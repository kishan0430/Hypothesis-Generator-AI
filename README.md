# 🔬 Hypothesis Generator AI
An autonomous scientific research engine powered by **Gemini 2.5 Flash**.

## 🌟 Features
- **AI Analysis:** Reads scientific PDFs and identifies knowledge gaps.
- **Priority Matrix:** Visualizes hypotheses by Impact vs Feasibility.
- **Interactive UI:** Spotlight mouse-tracking, smooth page transitions, and modern dark theme.
- **Auth System:** Secure session-based login and logout.

## 🛠️ Tech Stack
- **Frontend:** React, Tailwind CSS v4, Framer Motion, Recharts.
- **Backend:** FastAPI (Python), PyPDF.
- **Model:** Google Gemini 2.5.

## 🚀 Setup Instructions
1. Clone the repository.
2. Inside `/backend`, create a `.env` file with `GEMINI_API_KEY=your_key`.
3. Run `pip install -r requirements.txt` & `python main.py`.
4. Inside `/frontend`, run `npm install` & `npm run dev`.