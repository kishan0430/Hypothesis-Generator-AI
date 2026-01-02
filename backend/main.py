import os
import io
import json
import re
from google import genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

# 1. SETUP GENAI CLIENT (2026 Standard)
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file_bytes):
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        # Limit to 5 pages for presentation safety
        for page in reader.pages[:5]:
            content = page.extract_text()
            if content: text += content
        # LIMIT TO 4000 CHARS (Prevents 429 Resource Exhausted)
        return text[:4000] 
    except Exception:
        return ""

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        paper_text = extract_text(content)
        
        if len(paper_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="PDF is unreadable or too short.")

        # SIMPLE STABLE PROMPT
        prompt = f"Analyze this text and return a JSON object with 'summary' and 'hypotheses' list. TEXT: {paper_text}"

        # API Call using Stable 1.5 Flash (Highest Free Quota)
        response = client.models.generate_content(
            model="gemini-1.5-flash",
            contents=prompt
        )
        
        # --- JSON RESCUE LOGIC ---
        raw_text = response.text
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise Exception("AI failed to generate a stable data structure.")

    except Exception as e:
        error_str = str(e)
        print(f"DEBUG: {error_str}")
        
        # Friendly 429 Handling
        if "429" in error_str or "quota" in error_str.lower():
            raise HTTPException(status_code=429, detail="Google Free Quota reached. Wait 60s.")
            
        raise HTTPException(status_code=500, detail="AI Engine is busy. Please try a smaller PDF.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)