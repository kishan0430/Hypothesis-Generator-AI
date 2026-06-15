# 🔬 Autonomous Scientific Hypothesis Generator
An autonomous scientific research engine powered by **LLaMA 3.3 70B** via Groq Cloud.

## 🌟 Features
- **PDF Analysis:** Reads scientific research papers and extracts key content.
- **Knowledge Gap Detection:** Identifies unexplored areas and contradictions in the research.
- **Hypothesis Generation:** Proposes 5 novel, testable scientific hypotheses.
- **Impact & Feasibility Ranking:** Each hypothesis is scored on a 1-10 scale.
- **Priority Matrix:** Interactive scatter chart visualizing Impact vs Feasibility.
- **3-Gate Validation:** Rejects non-scientific documents (resumes, tutorials, etc.) using keyword + AI checks.
- **PDF Export:** Download the full analysis report as a formatted PDF.
- **Premium UI:** Dark theme with glassmorphism, animations, and smooth transitions.

## 🛠️ Tech Stack
- **Frontend:** React 19, Tailwind CSS v4, Framer Motion, Recharts, jsPDF
- **Backend:** FastAPI (Python), PyPDF, Uvicorn
- **AI Model:** LLaMA 3.3 · 70B Parameters (via Groq Cloud API)

## 🚀 Setup Instructions
1. Clone the repository.
2. Inside `/backend`, create a `.env` file with `GROQ_API_KEY=your_groq_api_key`.
3. Run `pip install -r requirements.txt` & `python main.py`.
4. Inside `/frontend`, run `npm install` & `npm run dev`.
5. Open `http://localhost:5173` in your browser.

## 📁 Project Structure
```
├── backend/
│   ├── main.py              # FastAPI server + 3-gate validation + LLM prompt
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # GROQ_API_KEY (not committed)
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── HomePage.jsx      # Landing page with features & how-it-works
│   │   │   ├── LabPage.jsx       # PDF upload & drag-drop interface
│   │   │   ├── AnalysisPage.jsx  # Results: summary, priority matrix, hypotheses
│   │   │   ├── AboutPage.jsx     # Platform info & tech stack
│   │   │   └── LoginPage.jsx     # Authentication UI
│   │   ├── App.jsx           # Routing & sidebar layout
│   │   └── main.jsx          # React entry point
│   └── index.html
└── README.md
```