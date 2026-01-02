import os
import io
import json
import re
from groq import Groq
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pypdf import PdfReader
from dotenv import load_dotenv

load_dotenv()

# 1. SETUP GROQ CLIENT (Free Tier Workhorse)
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()

# Allow your React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def extract_text(file_bytes):
    """Parses PDF and extracts text limited to 8000 chars for free tier quota."""
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages[:10]: # Read first 10 pages
            content = page.extract_text()
            if content: text += content
        return text[:8000]
    except Exception as e:
        print(f"PDF Extraction Error: {e}")
        return ""

@app.get("/")
def check_status():
    return {"status": "Research Analysis Engine Online"}

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        # Read uploaded file
        content = await file.read()
        paper_text = extract_text(content)
        
        if not paper_text.strip():
            raise HTTPException(status_code=400, detail="The PDF contains no readable text.")

        # --- THE REFINED DYNAMIC PROMPT ---
        # Note: I changed the instructions so the AI knows the summary MUST be unique.
        prompt = f"""
        Act as a Professional Scientific Analyst. 
        Analyze the specific document text provided below and generate a completely custom, unique discovery report based ONLY on this text.

        INSTRUCTIONS:
        1. SUMMARY: Write a unique 2-sentence summary describing the specific core findings of THIS specific document.
        2. GAPS: Identify 5 distinct technical or knowledge gaps found in this research.
        3. HYPOTHESES: Propose 5 novel, testable hypotheses to address these gaps.
        
        REQUIRED JSON STRUCTURE (Do not use generic placeholder text):
        {{
          "summary": "[REPLACE WITH UNIQUE SUMMARY OF THE PROVIDED TEXT]",
          "hypotheses": [
            {{ 
              "title": "Unique Study Title", 
              "gap": "Description of the gap", 
              "hypothesis": "Testable statement", 
              "impact": 9, 
              "feasibility": 7 
            }}
          ]
        }}

        DOCUMENT TEXT TO ANALYZE:
        {paper_text}
        """

        # API Call using Groq (Llama 3.3)
        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system", 
                    "content": "You are a Scientific Intelligence Assistant. You never summarize your own role; you only provide unique analysis of the input text. Your summaries must be 100% specific to the provided document."
                },
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )
        
        # Load and return the AI response
        ai_response = json.loads(completion.choices[0].message.content)
        return ai_response

    except Exception as e:
        print(f"CRITICAL ERROR: {str(e)}")
        # Send a user-friendly error to the UI
        raise HTTPException(status_code=500, detail="Analysis failed. Please try a different PDF or wait 30 seconds.")

if __name__ == "__main__":
    import uvicorn
    # Start server on Port 8000
    uvicorn.run(app, host="0.0.0.0", port=8000)