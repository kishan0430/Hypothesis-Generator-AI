import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Loader2, CheckCircle2, AlertTriangle, ShieldCheck, Sparkles, Upload, ArrowRight, X } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

/* ── Floating orb ── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

export default function LabPage({ setAnalysisData }) {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  const processFile = async (file) => {
    if (!file) return;

    setLoading(true);
    setErrorMessage(null);
    setSelectedFile(file);
    
    const formData = new FormData();
    formData.append('file', file);

    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

    try {
      const res = await axios.post(`${backendUrl}/generate-hypothesis`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setAnalysisData(res.data);
      navigate('/analysis');

    } catch (err) {
      console.error("Analysis Error:", err);
      const detail = err.response?.data?.detail || "AI Engine connection failed. Please restart backend.";
      setErrorMessage(detail);
    } finally {
      setLoading(false);
    }
  };

  const handleFile = (e) => {
    processFile(e.target.files[0]);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-8 md:p-12">
      {/* Background orbs */}
      <FloatingOrb className="w-80 h-80 bg-indigo-600/10 top-20 right-10" delay={0} />
      <FloatingOrb className="w-60 h-60 bg-violet-600/10 bottom-20 left-20" delay={2} />

      {/* Main card */}
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl relative"
      >
        {/* Card glow border */}
        <div className="absolute -inset-[1px] rounded-[2.5rem] bg-gradient-to-br from-indigo-600/20 via-violet-600/10 to-transparent" />
        
        <div className="relative bg-[#0c0e18]/90 backdrop-blur-2xl rounded-[2.5rem] p-12 md:p-16 text-center shadow-[0_30px_80px_rgba(0,0,0,0.4)] overflow-hidden">
          {/* Corner accent */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-indigo-600/[0.08] to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-violet-600/[0.06] to-transparent rounded-tr-full" />

          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div 
                key="loading"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8 py-8"
              >
                {/* Animated loader */}
                <div className="relative inline-block">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    className="w-20 h-20 border-[3px] border-indigo-500/20 border-t-indigo-500 rounded-full"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="w-3 h-3 bg-indigo-400 rounded-full shadow-lg shadow-indigo-400/50"
                    />
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h2 className="text-2xl font-black text-white tracking-tight">Analyzing Document</h2>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto leading-relaxed">
                    Running 3-gate validation, extracting content, and generating hypotheses...
                  </p>
                </div>

                {/* Progress steps */}
                <div className="max-w-xs mx-auto space-y-3 text-left">
                  {[
                    { text: 'Document validation', done: true },
                    { text: 'Scientific keyword check', done: true },
                    { text: 'AI integrity analysis', done: false },
                  ].map((step, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.8 }}
                      className="flex items-center gap-3 text-sm"
                    >
                      {step.done ? (
                        <CheckCircle2 size={16} className="text-green-400 shrink-0" />
                      ) : (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          className="w-4 h-4 border-2 border-indigo-400/30 border-t-indigo-400 rounded-full shrink-0"
                        />
                      )}
                      <span className={step.done ? 'text-slate-400' : 'text-indigo-300'}>{step.text}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="upload"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative z-10"
              >
                {/* Icon */}
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="inline-block mb-8"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-[1.5rem] blur-lg opacity-40" />
                    <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 w-20 h-20 rounded-[1.5rem] flex items-center justify-center shadow-xl shadow-indigo-500/25">
                      <FileUp size={36} className="text-white" />
                    </div>
                  </div>
                </motion.div>
                
                <h1 className="text-3xl md:text-4xl font-black mb-4 text-white tracking-tight">
                  Research <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Lab</span>
                </h1>
                
                <p className="text-slate-400 mb-10 text-base max-w-md mx-auto leading-relaxed">
                  Upload a <span className="text-white font-semibold">scientific research paper</span> to begin 
                  the autonomous analysis and hypothesis generation.
                </p>
                
                {/* Error message */}
                {errorMessage && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8 p-5 bg-red-950/40 border border-red-500/20 rounded-2xl flex items-start gap-4 text-left"
                  >
                    <AlertTriangle className="shrink-0 mt-0.5 text-red-400" size={18} />
                    <div className="space-y-1">
                      <p className="font-bold text-red-400 text-xs uppercase tracking-widest">Validation Failed</p>
                      <p className="text-sm text-red-300/80 leading-relaxed">{errorMessage}</p>
                    </div>
                    <button onClick={() => setErrorMessage(null)} className="text-red-500/50 hover:text-red-400 shrink-0">
                      <X size={16} />
                    </button>
                  </motion.div>
                )}

                {/* Drag & Drop Zone */}
                <div
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => inputRef.current?.click()}
                  className={`relative cursor-pointer mb-8 p-10 rounded-2xl border-2 border-dashed transition-all duration-300 ${
                    dragActive
                      ? 'border-indigo-400 bg-indigo-500/[0.06]'
                      : 'border-white/[0.08] hover:border-indigo-500/30 hover:bg-white/[0.02]'
                  }`}
                >
                  <input 
                    ref={inputRef}
                    type="file" 
                    className="hidden" 
                    onChange={handleFile} 
                    accept=".pdf" 
                  />
                  <Upload size={24} className={`mx-auto mb-3 ${dragActive ? 'text-indigo-400' : 'text-slate-600'}`} />
                  <p className={`text-sm font-medium ${dragActive ? 'text-indigo-300' : 'text-slate-500'}`}>
                    {dragActive ? 'Drop your PDF here' : 'Drag & drop your PDF here, or click to browse'}
                  </p>
                  <p className="text-[11px] text-slate-700 mt-2">Supports .pdf files only • Max 10 pages analyzed</p>
                </div>

                {/* Or button */}
                <div className="relative group inline-block">
                  <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 opacity-70 group-hover:opacity-100 blur-sm transition-opacity" />
                  <label 
                    htmlFor="pdfUploadMain" 
                    className="relative inline-flex items-center gap-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-4 rounded-2xl font-bold text-base cursor-pointer transition-all shadow-xl overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                      animate={{ x: ['-200%', '200%'] }}
                      transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
                    />
                    <span className="relative">Select Document</span>
                    <ArrowRight size={18} className="relative" />
                  </label>
                  <input 
                    type="file" 
                    id="pdfUploadMain" 
                    className="hidden" 
                    onChange={handleFile} 
                    accept=".pdf" 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Status footer */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ delay: 0.5 }}
        className="mt-8 flex items-center gap-5 text-[10px] font-bold uppercase tracking-[0.3em]"
      >
        <span className="flex items-center gap-2 text-green-500/70"><CheckCircle2 size={11}/> Engine Online</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span className="flex items-center gap-2 text-indigo-400/70"><ShieldCheck size={11}/> 3-Gate Validation</span>
        <span className="w-1 h-1 rounded-full bg-slate-800" />
        <span className="flex items-center gap-2 text-violet-400/70"><Sparkles size={11}/> LLaMA 3.3 Active</span>
      </motion.div>
    </div>
  );
}