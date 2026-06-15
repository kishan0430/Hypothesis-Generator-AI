import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Zap, Shield, Globe, Sparkles, Brain, FlaskConical, BarChart3, FileSearch } from 'lucide-react';
import { Link } from 'react-router-dom';

/* ── Floating orb for background ── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ── Stat card ── */
const StatCard = ({ value, label, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    className="text-center"
  >
    <p className="text-3xl md:text-4xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">{value}</p>
    <p className="text-slate-500 text-xs font-semibold mt-1 uppercase tracking-widest">{label}</p>
  </motion.div>
);

/* ── Feature card ── */
const FeatureCard = ({ icon: Icon, title, desc, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.25 } }}
    className="relative group"
  >
    {/* Glow on hover */}
    <div className={`absolute -inset-[1px] rounded-[1.8rem] ${gradient} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`} />
    
    <div className="relative p-8 rounded-[1.8rem] bg-[#0c0e18]/90 backdrop-blur-md border border-white/[0.06] overflow-hidden h-full">
      {/* Corner accent */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${gradient} opacity-[0.07] rounded-bl-full`} />
      
      <div className="relative z-10 text-left">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 border border-white/[0.08] bg-gradient-to-br ${gradient} shadow-lg`}>
          <Icon size={22} className="text-white" />
        </div>
        <h3 className="text-lg font-bold mb-2 text-white tracking-tight">{title}</h3>
        <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
      </div>
    </div>
  </motion.div>
);

/* ── Step card ── */
const StepCard = ({ number, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="flex gap-5 items-start"
  >
    <div className="shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white font-black text-sm shadow-lg shadow-indigo-500/20">
      {number}
    </div>
    <div>
      <h4 className="text-white font-bold text-sm mb-1">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background orbs */}
      <FloatingOrb className="w-80 h-80 bg-indigo-600/15 top-10 right-20" delay={0} />
      <FloatingOrb className="w-60 h-60 bg-violet-600/10 bottom-40 left-10" delay={3} />
      
      <div className="p-8 md:p-14 max-w-6xl mx-auto relative">
        {/* ── HERO SECTION ── */}
        <div className="text-center space-y-8 pt-8 pb-16">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold backdrop-blur-sm"
            >
              <Sparkles size={12} />
              Powered by LLaMA 3.3 · 70B Parameters
            </motion.span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-[3.8rem] font-black tracking-tight leading-[1.1] text-white">
              Bridging the Gap Between
              <br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-blue-400 bg-clip-text text-transparent">
                Big Data & Breakthroughs
              </span>
            </h1>
          </motion.div>

          {/* Description */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-2xl mx-auto space-y-3"
          >
            <p className="text-slate-400 text-lg leading-relaxed">
              <strong className="text-white">The Core Problem:</strong> Millions of papers are published annually, 
              making it impossible to find every knowledge gap.
            </p>
            <p className="text-slate-400 text-lg leading-relaxed">
              <strong className="text-indigo-400">The Solution:</strong> An autonomous AI that identifies unexplored 
              areas and proposes novel, testable hypotheses in seconds.
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex justify-center pt-4"
          >
            <Link to="/lab">
              <div className="relative group">
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 opacity-75 group-hover:opacity-100 blur-sm transition-opacity" />
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  className="relative bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white px-10 py-4 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl overflow-hidden"
                >
                  {/* Shimmer */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                    animate={{ x: ['-200%', '200%'] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 2, ease: 'linear' }}
                  />
                  <span className="relative">Start Analyzing</span>
                  <ArrowRight size={20} className="relative group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </Link>
          </motion.div>
        </div>

        {/* ── STATS ROW ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-16 py-10 mb-10 border-y border-white/[0.04]"
        >
          <StatCard value="5" label="Hypotheses / Paper" delay={1.1} />
          <StatCard value="<10s" label="Analysis Time" delay={1.2} />
          <StatCard value="70B" label="Model Parameters" delay={1.3} />
          <StatCard value="3-Gate" label="Validation System" delay={1.4} />
        </motion.div>

        {/* ── HOW IT WORKS ── */}
        <div className="py-10">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-3">How It Works</p>
            <h2 className="text-3xl font-black text-white tracking-tight">Three Steps to Discovery</h2>
          </motion.div>

          <div className="max-w-lg mx-auto space-y-8">
            <StepCard number="1" title="Upload Your Research Paper" desc="Drop any peer-reviewed scientific PDF into the Research Lab." delay={0.1} />
            <StepCard number="2" title="AI Validates & Analyzes" desc="Our 3-gate validation ensures only real research is processed, then LLaMA identifies knowledge gaps." delay={0.2} />
            <StepCard number="3" title="Get 5 Novel Hypotheses" desc="Receive testable hypotheses ranked by Impact & Feasibility on an interactive Priority Matrix." delay={0.3} />
          </div>
        </div>

        {/* ── FEATURES GRID ── */}
        <div className="py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-3">Capabilities</p>
            <h2 className="text-3xl font-black text-white tracking-tight">Built for Researchers</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard icon={Brain} title="Deep Understanding" desc="Processes complex scientific terminology and cross-references data in real-time." gradient="from-indigo-500 to-blue-600" delay={0.1} />
            <FeatureCard icon={FileSearch} title="Gap Detection" desc="Identifies blind spots and contradictions in experimental literature." gradient="from-violet-500 to-purple-600" delay={0.2} />
            <FeatureCard icon={FlaskConical} title="Hypothesis Gen" desc="Creates testable, novel hypotheses based on genuine research gaps." gradient="from-blue-500 to-cyan-600" delay={0.3} />
            <FeatureCard icon={BarChart3} title="Impact Scoring" desc="Prioritizes breakthroughs by global feasibility and scientific potential." gradient="from-emerald-500 to-teal-600" delay={0.4} />
          </div>
        </div>
      </div>
    </div>
  );
}