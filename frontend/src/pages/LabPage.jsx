import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Loader2, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LabPage({ setAnalysisData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // --- THE MAIN FUNCTION ---
  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Reset states
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    // Get the backend URL (from Render environment or localhost)
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await axios.post(`${backendUrl}/generate-hypothesis`, formData);
      
      // If successful, save data and go to Analysis
      setAnalysisData(res.data);
      navigate('/analysis');

    } catch (err) {
      // --- THE CRITICAL ERROR LOGIC ---
      // This catches the "Access Denied" message from your Python backend
      const message = err.response?.data?.detail || "Connection to AI Engine failed.";
      setError(message);
      
      // Also show an alert so it's impossible to miss
      alert("⚠️ " + message);
      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 h-full flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="w-full max-w-2xl bg-[#0f1117]/80 border border-white/5 rounded-[3rem] p-16 text-center shadow-2xl backdrop-blur-xl relative overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 rounded-full blur-[80px]" />

        {loading ? (
          <div className="space-y-6 relative z-10">
            <Loader2 size={60} className="animate-spin mx-auto text-blue-500" />
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white tracking-tight">Analyzing Document</h2>
              <p className="text-slate-400">Gemini 2.5 is checking for scientific validity...</p>
            </div>
          </div>
        ) : (
          <div className="relative z-10">
            <div className="bg-blue-600/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
              <FileUp size={48} className="text-blue-500" />
            </div>
            
            <h2 className="text-4xl font-bold mb-4 text-white tracking-tighter">Research Lab</h2>
            <p className="text-slate-400 mb-10 text-lg max-w-sm mx-auto leading-relaxed">
              Upload your <span className="text-white font-bold underline decoration-blue-500 underline-offset-4">Scientific PDF</span> to identify knowledge gaps.
            </p>
            
            {/* Show error message if it exists */}
            {error && (
              <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm font-medium text-left animate-in fade-in slide-in-from-top-2">
                <AlertTriangle size={20} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <input 
              type="file" 
              id="pdfUpload" 
              className="hidden" 
              onChange={handleFile} 
              accept=".pdf" 
            />
            <label 
              htmlFor="pdfUpload" 
              className="inline-block bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 uppercase tracking-widest"
            >
              Select Paper
            </label>
          </div>
        )}
      </motion.div>

      <p className="mt-8 text-slate-600 text-xs font-bold uppercase tracking-[0.3em]">
        Strict Validation Mode Active
      </p>
    </div>
  );
}