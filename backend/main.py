import os
import io
import json
import google.generativeai as genai
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel('gemini-2.0-flash')

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FIXED FUNCTION NAME ---
def extract_text(file_bytes):
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        # Limit to first 10 pages for safety and speed
        for page in reader.pages[:10]:
            content = page.extract_text()
            if content:
                text += content
        return text[:8000] # Safe character limit for free tier
    except Exception as e:
        raise Exception(f"PDF Error: {str(e)}")

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        paper_text = extract_text(content) # Calling the correct name now
        
        if not paper_text.strip():
            raise HTTPException(status_code=400, detail="The PDF contains no readable text.")

        # --- THE STRICT GUARDRAIL PROMPT ---
        prompt = f"""
        Act as a Strict Scientific Gatekeeper.
        
        STEP 1: Identify the document type.
        STEP 2: IF the document is a Resume, CV, Bio-data, or Portfolio, STOP and return ONLY this JSON:
        {{ "error": "Access Denied: Resumes and CVs are not permitted. Please upload a Scientific Research Paper." }}
        
        STEP 3: ONLY IF it is a Scientific Research Paper, return this JSON:
        {{
          "summary": "...",
          "hypotheses": [
            {{ "title": "...", "gap": "...", "hypothesis": "...", "impact": 9, "feasibility": 8 }}
          ]
        }}
        
        DOC TO ANALYZE:
        {paper_text}
        """

        response = model.generate_content(prompt)
        
        # Clean the response
        raw_text = response.text.replace('```json', '').replace('```', '').strip()
        data = json.loads(raw_text)

        # CHECK FOR RESUME ERROR
        if "error" in data:
            raise HTTPException(status_code=400, detail=data["error"])

        return data

    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="AI response was not valid JSON.")
    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Server Error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)