import os
import io
import json
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-1.5-flash-latest') # Use flash for faster logic

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
        for page in reader.pages[:10]:
            content = page.extract_text()
            if content: text += content
        return text.lower() # Convert to lowercase for easier checking
    except Exception as e:
        raise Exception(f"PDF Error: {str(e)}")

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        raw_text = extract_text(content)
        
        # --- PHASE 1: HARD-CODED RESUME DETECTION ---
        # If these words appear, it's almost certainly a resume
        resume_keywords = ["experience", "education", "skills", "projects", "contact", "phone:", "email:", "languages", "summary", "objective", "achievements"]
        match_count = sum(1 for word in resume_keywords if word in raw_text)
        
        # If more than 4 resume keywords appear, block it immediately
        if match_count > 4:
             raise HTTPException(status_code=400, detail="CRITICAL REJECTION: This document appears to be a Resume/CV. This engine ONLY accepts Scientific Research Papers.")

        # --- PHASE 2: AGGRESSIVE AI VALIDATION ---
        prompt = f"""
        SYSTEM INSTRUCTION: You are a Scientific Integrity Officer. 
        Your ONLY job is to analyze peer-reviewed research papers.
        
        STRICT RULE: If the following text is a Resume, CV, Bio-data, or Personal Profile, you MUST respond with the word "INVALID" and nothing else. 
        DO NOT try to be helpful. DO NOT extract hypotheses from a resume.
        
        IF AND ONLY IF the text is a legitimate Scientific Research Paper (containing Abstract, Methodology, Results, or Citations), provide a JSON analysis:
        {{
          "summary": "...",
          "hypotheses": [
            {{ "title": "...", "gap": "...", "hypothesis": "...", "impact": 9, "feasibility": 8 }}
          ]
        }}
        
        DOCUMENT TEXT:
        {raw_text[:10000]}
        """

        response = model.generate_content(prompt)
        response_text = response.text.strip()

        # If AI says it's invalid
        if "INVALID" in response_text.upper():
            raise HTTPException(status_code=400, detail="AI REJECTION: This document is not a scientific research paper. Please upload a study or thesis.")

        # Try to parse the JSON
        clean_json = response_text.replace('```json', '').replace('```', '').strip()
        return json.loads(clean_json)

    except json.JSONDecodeError:
        raise HTTPException(status_code=400, detail="The AI could not verify this as a scientific document.")
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)