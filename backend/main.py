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

# 1. SETUP CLIENT
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

def extract_text(file_bytes):
    try:
        reader = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in reader.pages[:10]:
            content = page.extract_text()
            if content: text += content
        return text.lower() # Return lowercase for easier keyword checking
    except: return ""

@app.post("/generate-hypothesis")
async def generate_hypothesis(file: UploadFile = File(...)):
    try:
        content = await file.read()
        raw_text = extract_text(content)
        
        
        # --- GATE 1: NEGATIVE KEYWORD BLOCKER ---
        # Reject Resumes, Portfolios, and non-academic documents
        # NOTE: Only use keywords UNIQUE to resumes/CVs, not words that also appear in research papers
        invalid_keywords = [
            "curriculum vitae", "cover letter", "personal statement", "portfolio",
            "hobbies", "linkedin", "github.com", "objective", "phone:",
            "contact:", "skills:", "work experience", "job title", "career objective",
            "extracurricular", "internship", "employer", "salary", "proficiency"
        ]
        invalid_count = sum(1 for word in invalid_keywords if word in raw_text)
        
        if invalid_count > 5:
             raise HTTPException(status_code=400, detail="INVALID DOCUMENT: This appears to be a Resume/CV. Please upload a Scientific Research Paper.")

        # --- GATE 2: POSITIVE SCIENTIFIC KEYWORD CHECK ---
        # A real research paper must contain several of these markers
        scientific_keywords = [
            "abstract", "introduction", "methodology", "method", "results", 
            "conclusion", "discussion", "hypothesis", "experiment", "literature review",
            "findings", "analysis", "data", "study", "research", "participants",
            "sample", "variables", "statistical", "p-value", "significant",
            "references", "bibliography", "doi", "journal", "proceedings",
            "peer-reviewed", "clinical", "theoretical", "empirical", "quantitative",
            "qualitative", "control group", "observation", "survey", "regression"
        ]
        science_count = sum(1 for word in scientific_keywords if word in raw_text)
        
        if science_count < 4:
            raise HTTPException(
                status_code=400, 
                detail="INVALID DOCUMENT: This does not appear to be a scientific research paper. "
                       "A valid paper should contain sections like Abstract, Introduction, Methodology, "
                       "Results, and Conclusion. Please upload a legitimate research paper, thesis, or case study."
            )

        # --- GATE 3: AI INTEGRITY CHECKER (STRICT) ---
        prompt = f"""
        TASK: You are a STRICT Scientific Journal Gatekeeper. Your ONLY job is to determine if a document 
        is a legitimate, peer-reviewed scientific research paper, academic thesis, or formal case study.

        STRICT REJECTION CRITERIA — Respond with {{"error": "INVALID_TYPE"}} if the document is ANY of the following:
        - A tutorial, guide, manual, or "how-to" document
        - A textbook chapter or educational material  
        - A blog post, article, or informal write-up
        - A resume, CV, portfolio, or cover letter
        - A business report, marketing material, or product documentation
        - A general overview or survey WITHOUT original research contribution
        - A document about software tools (Excel, Python, etc.) without scientific experimentation
        - ANY document that does NOT have a clear: Research Question, Methodology, Original Results/Findings, and Discussion

        ACCEPTANCE CRITERIA — ONLY accept if ALL of these are present:
        1. A clear research question or scientific objective
        2. A structured methodology describing how experiments/studies were conducted  
        3. Original data, results, or findings from the research
        4. A discussion or conclusion interpreting the results
        5. Academic references/citations to prior scientific work

        If REJECTED, respond ONLY with: {{"error": "INVALID_TYPE"}}

        If ACCEPTED as a valid scientific paper, generate this JSON with EXACTLY 5 distinct hypotheses:
        {{
          "summary": "A concise 1-2 sentence summary of the paper's research contribution.",
          "hypotheses": [
            {{ "title": "Hypothesis Title 1", "gap": "The specific knowledge gap this addresses", "hypothesis": "A clear, testable hypothesis statement", "impact": 9, "feasibility": 8 }},
            {{ "title": "Hypothesis Title 2", "gap": "The specific knowledge gap this addresses", "hypothesis": "A clear, testable hypothesis statement", "impact": 7, "feasibility": 9 }},
            {{ "title": "Hypothesis Title 3", "gap": "The specific knowledge gap this addresses", "hypothesis": "A clear, testable hypothesis statement", "impact": 8, "feasibility": 6 }},
            {{ "title": "Hypothesis Title 4", "gap": "The specific knowledge gap this addresses", "hypothesis": "A clear, testable hypothesis statement", "impact": 6, "feasibility": 7 }},
            {{ "title": "Hypothesis Title 5", "gap": "The specific knowledge gap this addresses", "hypothesis": "A clear, testable hypothesis statement", "impact": 9, "feasibility": 5 }}
          ]
        }}

        IMPORTANT: You MUST generate exactly 5 unique hypotheses based on different research gaps found in the paper. Each hypothesis must explore a different angle or aspect of the research.
        REMEMBER: When in doubt, REJECT. Only accept documents that are clearly original scientific research.

        TEXT TO ANALYZE:
        {raw_text[:8000]}
        """

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )
        
        ai_data = json.loads(completion.choices[0].message.content)

        # If AI detected an invalid document type
        if ai_data.get("error") == "INVALID_TYPE":
            raise HTTPException(status_code=400, detail="ACCESS DENIED: The AI determined this is not a legitimate scientific research document.")

        return ai_data

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Analysis failed. Ensure the PDF contains readable research text.")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)