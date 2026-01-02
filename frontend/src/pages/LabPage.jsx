import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LabPage({ setAnalysisData }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await axios.post(`${backendUrl}/generate-hypothesis`, formData);
      setAnalysisData(res.data);
      navigate('/analysis');
    } catch (err) {
      const detail = err.response?.data?.detail || "AI Engine busy. Wait 60 seconds.";
      setError(detail);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 h-full flex flex-col items-center justify-center bg-transparent">
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }} 
        className="w-full max-w-2xl bg-[#0f1117]/80 border border-white/5 rounded-[3rem] p-16 text-center shadow-2xl backdrop-blur-xl relative"
      >
        {loading ? (
          <div className="space-y-6">
            <Loader2 size={60} className="animate-spin mx-auto text-blue-500" />
            <h2 className="text-3xl font-bold text-white tracking-tight">Analyzing Document</h2>
            <p className="text-slate-400">Processing through Gemini 1.5 Synthesis Engine...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="bg-blue-600/10 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto border border-blue-500/20">
              <FileUp size={40} className="text-blue-500" />
            </div>
            
            <h2 className="text-4xl font-bold text-white tracking-tighter uppercase">Research Lab</h2>
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-3 text-red-400 text-sm text-left animate-pulse">
                <AlertTriangle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <input type="file" id="pdfUpload" className="hidden" onChange={handleFile} accept=".pdf" />
            <label htmlFor="pdfUpload" className="inline-block bg-blue-600 hover:bg-white hover:text-blue-600 text-white px-12 py-5 rounded-2xl font-black text-lg cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20 uppercase tracking-widest">
              Select Document
            </label>
          </div>
        )}
      </motion.div>

      <div className="mt-8 flex items-center gap-4 text-slate-500 text-[10px] font-bold uppercase tracking-[0.4em]">
        <span className="flex items-center gap-1.5 text-green-500/80"><CheckCircle2 size={12}/> Engine Online</span>
        <span>|</span>
        <span>Low-Latency Mode Active</span>
      </div>
    </div>
  );
}