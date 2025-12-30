import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileUp, Loader2 } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function LabPage({ setAnalysisData }) {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFile = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    
    const formData = new FormData();
    formData.append('file', file);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const res = await axios.post(`${backendUrl}/generate-hypothesis`, formData);
      setAnalysisData(res.data);
      navigate('/analysis'); // Automatically jump to the results page
    } catch (err) {
      alert("Error: " + (err.response?.data?.detail || "Connection failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-12 h-full flex flex-col items-center justify-center">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-2xl bg-slate-900/80 border border-slate-800 rounded-[2.5rem] p-16 text-center shadow-2xl backdrop-blur-xl"
      >
        {loading ? (
          <div className="space-y-6">
            <Loader2 size={60} className="animate-spin mx-auto text-blue-500" />
            <h2 className="text-2xl font-bold text-white">Extracting Scientific Insight...</h2>
            <p className="text-slate-400">The AI is cross-referencing your PDF with current knowledge bases.</p>
          </div>
        ) : (
          <>
            <div className="bg-blue-500/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
              <FileUp size={48} className="text-blue-500" />
            </div>
            <h2 className="text-3xl font-bold mb-4">Start New Analysis</h2>
            <p className="text-slate-400 mb-10 text-lg">Upload your research paper (PDF) to begin the hypothesis generation process.</p>
            
            <input type="file" id="pdfUpload" className="hidden" onChange={handleFile} />
            <label htmlFor="pdfUpload" className="inline-block bg-blue-600 hover:bg-blue-700 px-10 py-5 rounded-2xl font-bold cursor-pointer transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20">
              Select Document
            </label>
          </>
        )}
      </motion.div>
    </div>
  );
}