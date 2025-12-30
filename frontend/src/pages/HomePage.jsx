import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, Play, X } from 'lucide-react';
import { Link } from 'react-router-dom';

/**
 * REVEAL TEXT COMPONENT
 * Words emerge smoothly with a balanced font size.
 */
const RevealText = ({ text, delay = 0 }) => {
  const words = text.split(" ");
  return (
    <span className="inline-block overflow-hidden pb-1">
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            duration: 0.8, 
            delay: delay + (i * 0.08), 
            ease: [0.16, 1, 0.3, 1] 
          }}
          className="inline-block mr-3"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

const FeatureCard = ({ icon: Icon, title, desc }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <motion.div 
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative group p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800/50 overflow-hidden transition-all backdrop-blur-sm"
    >
      <div 
        className="absolute inset-0 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(59, 130, 246, 0.1), transparent 40%)`
        }}
      />
      <div className="relative z-10 text-left">
        <div className="bg-blue-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-blue-500/10 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
          <Icon size={24} />
        </div>
        <h3 className="text-xl font-bold mb-3 text-white tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm font-medium">{desc}</p>
      </div>
    </motion.div>
  );
};

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="p-8 md:p-12 max-w-6xl mx-auto relative min-h-screen">
      
      {/* --- BALANCED HERO SECTION --- */}
      <div className="text-center space-y-8 py-16 md:py-24">
        <motion.span 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="px-4 py-1.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/20 uppercase tracking-[0.2em] inline-block"
        >
          POWERED BY GEMINI 2.5
        </motion.span>
        
        {/* IMPROVED TYPOGRAPHY: Smaller, cleaner, better spacing */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] text-white">
          <RevealText text="Automating the Future" delay={0.2} /> <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
            <RevealText text="of Scientific Discovery" delay={0.4} />
          </span>
        </h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed"
        >
          Hypothesis Generator reads your research papers, identifies hidden knowledge gaps, and proposes high-impact testable hypotheses in seconds.
        </motion.p>
        
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="flex flex-wrap gap-4 justify-center pt-6"
        >
          <Link to="/lab" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20 group">
            Get Started <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/>
          </Link>
          
          <button 
            onClick={() => setIsModalOpen(true)}
            className="group border border-slate-700 hover:border-slate-500 text-white px-8 py-3.5 rounded-2xl font-bold transition-all flex items-center gap-2 bg-white/5 backdrop-blur-md"
          >
            <Play size={16} fill="currentColor" />
            Watch Demo
          </button>
        </motion.div>
      </div>

      {/* --- FEATURES GRID --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pb-24">
        <FeatureCard 
          icon={Zap} 
          title="Instant Synthesis" 
          desc="Decipher decades of research in under 10 seconds." 
        />
        <FeatureCard 
          icon={Shield} 
          title="Gap Detection" 
          desc="Identify blind spots in experimental literature." 
        />
        <FeatureCard 
          icon={Globe} 
          title="Impact Scoring" 
          desc="Ranking based on global breakthrough potential." 
        />
      </div>

      {/* --- MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10">
              <button onClick={() => setIsModalOpen(false)} className="absolute top-4 right-4 z-20 p-2 bg-white/10 text-white rounded-full hover:bg-red-500 transition-colors"><X size={20} /></button>
              <iframe width="100%" height="100%" src="https://www.youtube.com/embed/S_vTtoitM_s?autoplay=1&mute=1" title="Demo" frameBorder="0" allowFullScreen></iframe>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}