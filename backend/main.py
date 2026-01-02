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
api_key = os.getenv("GEMINI_API_KEY")
client = genai.Client(api_key=api_key)

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
        # We only read the first 5 pages to stay within FREE TIER limits
        for page in reader.pages[:5]:
            content = page.extract_text()
            if content: text += content
        return text
    except Exception as e:
        print(f"PDF Error: {e}")
        return ""

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        paper_text = extract_text(content)
        
        if len(paper_text.strip()) < 50:
            raise HTTPException(status_code=400, detail="Document text is too short or unreadable.")

        # --- OPTIMIZATION: Limit to 4000 characters to avoid 429 errors ---
        safe_text = paper_text[:4000]

        prompt = f"""
        Act as a Senior Research Scientist. Analyze this paper excerpt:
        {safe_text}

        Return ONLY a JSON object with this exact structure:
        {{
          "summary": "2-sentence overview",
          "hypotheses": [
            {{ "title": "...", "gap": "...", "hypothesis": "...", "impact": 9, "feasibility": 8 }}
          ]
        }}
        """

        # API Call
        response = client.models.generate_content(
            model="gemini-2.0-flash",
            contents=prompt
        )
        
        # Clean JSON Response
        raw_text = response.text
        match = re.search(r'\{.*\}', raw_text, re.DOTALL)
        if match:
            return json.loads(match.group(0))
        else:
            raise Exception("AI failed to return valid JSON.")

    except Exception as e:
        error_str = str(e)
        print(f"SERVER LOG: {error_str}")
        
        # Catch Rate Limit specifically
        if "429" in error_str or "quota" in error_str.lower():
            raise HTTPException(status_code=429, detail="Rate Limit: Please wait 60 seconds.")
            
        raise HTTPException(status_code=500, detail=error_str)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)