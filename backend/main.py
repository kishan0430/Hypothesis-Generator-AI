import os
import io
import json
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

# 1. NEW 2025 CONFIGURATION
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
# Using the stable December 2025 model
model = genai.GenerativeModel('gemini-2.5-flash')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_safe_text(file_bytes):
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        # We only take the first few pages to stay under Free Tier Token limits
        for page in reader.pages[:10]: 
            content = page.extract_text()
            if content: text += content
        # LIMIT TO 8,000 CHARS (Safe for 2025 Free Tier TPM)
        return text[:8000] 
    except Exception as e:
        raise Exception(f"PDF Error: {str(e)}")

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        paper_text = extract_safe_text(content)
        
        if not paper_text.strip():
            raise HTTPException(status_code=400, detail="No readable text in PDF.")

        prompt = f"""
        Act as a Senior Scientist. Review this paper excerpt:
        {paper_text}

        Generate a JSON response with:
        "summary": "2 sentence overview",
        "hypotheses": [
            {{"title": "...", "gap": "...", "hypothesis": "...", "impact": 9, "feasibility": 7}}
        ]
        Return ONLY valid JSON.
        """

        response = model.generate_content(prompt)
        
        # 2025 AI cleaning logic
        raw = response.text.replace('```json', '').replace('```', '').strip()
        return json.loads(raw)

    except Exception as e:
        err_msg = str(e)
        print(f"Server Log: {err_msg}")
        
        # Specific 2025 Error Handling
        if "429" in err_msg or "quota" in err_msg.lower():
            raise HTTPException(status_code=429, detail="2025 Free Quota reached. Please wait 2 mins or use a smaller PDF.")
        if "404" in err_msg:
            raise HTTPException(status_code=404, detail="Model outdated. Please check main.py line 13.")
            
        raise HTTPException(status_code=500, detail="Gemini Error: " + err_msg)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)