import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Beaker, ShieldCheck, Globe, Sparkles, BrainCircuit, FlaskConical, BarChart3, Lock } from 'lucide-react';

/* ── Floating orb ── */
const FloatingOrb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
    transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ── About card ── */
const AboutCard = ({ icon: Icon, title, desc, gradient, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    whileHover={{ y: -5, transition: { duration: 0.25 } }}
    className="relative group"
  >
    <div className={`absolute -inset-[1px] rounded-[1.8rem] ${gradient} opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-500`} />
    <div className="relative p-8 rounded-[1.8rem] bg-[#0c0e18]/90 backdrop-blur-md border border-white/[0.06] overflow-hidden h-full">
      <div className={`absolute top-0 right-0 w-20 h-20 ${gradient} opacity-[0.06] rounded-bl-full`} />
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-gradient-to-br ${gradient} shadow-lg`}>
        <Icon className="text-white" size={26} />
      </div>
      <h3 className="text-lg font-bold text-white mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
    </div>
  </motion.div>
);

/* ── Tech stack item ── */
const TechItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-none">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-white font-bold text-sm">{value}</span>
  </div>
);

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <FloatingOrb className="w-80 h-80 bg-indigo-600/10 top-20 right-20" delay={0} />
      <FloatingOrb className="w-60 h-60 bg-violet-600/10 bottom-40 left-10" delay={3} />

      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        className="p-8 md:p-14 max-w-5xl mx-auto space-y-16"
      >
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <motion.span
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-950/60 border border-indigo-500/25 text-indigo-300 text-[11px] font-semibold"
            >
              <Sparkles size={12} />
              About the Platform
            </motion.span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tight"
          >
            Our <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Mission</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed"
          >
            Autonomous Hypothesis Generator was built to solve the <strong className="text-white">"Knowledge Bottleneck."</strong> Every year, 
            millions of scientific papers are published, making it impossible for humans to track every gap. We use advanced 
            LLMs to bridge those gaps and spark the next generation of breakthroughs.
          </motion.p>
        </section>

        {/* Grid of Values */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <AboutCard 
            icon={Cpu} 
            title="Neural Engine" 
            desc="Powered by LLaMA 3.3 70B, our engine processes complex scientific terminology and cross-references data in real-time with unprecedented accuracy." 
            gradient="from-indigo-500 to-blue-600"
            delay={0.1}
          />
          <AboutCard 
            icon={Target} 
            title="Gap Identification" 
            desc="Our proprietary algorithms scan for contradictions and missing experimental links that human eyes might overlook in vast research literature." 
            gradient="from-violet-500 to-purple-600"
            delay={0.2}
          />
          <AboutCard 
            icon={Beaker} 
            title="Rigorous Metrics" 
            desc="Hypotheses aren't just generated; they are ranked by technical feasibility and potential societal impact using multi-dimensional scoring." 
            gradient="from-blue-500 to-cyan-600"
            delay={0.3}
          />
          <AboutCard 
            icon={ShieldCheck} 
            title="Ethical AI" 
            desc="We prioritize data privacy. Your research stays your research. No data is used for training without explicit consent. Zero data retention." 
            gradient="from-emerald-500 to-teal-600"
            delay={0.4}
          />
        </div>

        {/* Tech Stack Section */}
        <section className="relative overflow-hidden">
          <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-indigo-600/15 via-transparent to-violet-600/10" />
          <div className="relative bg-[#0c0e18]/90 backdrop-blur-md border border-white/[0.04] p-10 rounded-[2rem]">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-600/[0.06] to-transparent rounded-bl-full" />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-6 tracking-tight">
                  <BrainCircuit className="text-indigo-400" size={24} /> Tech Stack
                </h2>
                <div>
                  <TechItem label="AI Model" value="LLaMA 3.3 · 70B Parameters" />
                  <TechItem label="API Provider" value="Groq Cloud (Ultra-fast)" />
                  <TechItem label="Backend" value="FastAPI · Python 3.14" />
                  <TechItem label="Frontend" value="React 19 · Vite · Tailwind v4" />
                  <TechItem label="Animations" value="Framer Motion" />
                  <TechItem label="PDF Processing" value="PyPDF" />
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-6 tracking-tight">
                  <Lock className="text-indigo-400" size={24} /> Security
                </h2>
                <div>
                  <TechItem label="Validation" value="3-Gate System" />
                  <TechItem label="Resume Detection" value="Keyword + AI" />
                  <TechItem label="Scientific Check" value="30+ Keyword Markers" />
                  <TechItem label="AI Integrity" value="Strict Gatekeeper Prompt" />
                  <TechItem label="Data Retention" value="None (Stateless)" />
                  <TechItem label="Auth" value="Session-based" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="relative overflow-hidden">
          <div className="absolute -inset-[1px] rounded-[2rem] bg-gradient-to-br from-violet-600/15 via-transparent to-indigo-600/10" />
          <div className="relative bg-[#0c0e18]/90 backdrop-blur-md border border-white/[0.04] p-10 rounded-[2rem]">
            <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-4 tracking-tight">
              <Globe className="text-indigo-400" size={24} /> Global Impact
            </h2>
            <p className="text-slate-400 leading-relaxed text-base italic">
              "By automating the literature review and hypothesis generation phase, we aim to reduce the time from 
              'Question' to 'Discovery' by up to 70%. Our platform is designed for researchers, PhD students, and 
              R&D departments across the globe."
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 mt-8 pt-6 border-t border-white/[0.04]">
              <div className="text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">70%</p>
                <p className="text-slate-600 text-xs font-semibold mt-1 uppercase tracking-widest">Time Saved</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">5</p>
                <p className="text-slate-600 text-xs font-semibold mt-1 uppercase tracking-widest">Hypotheses / Paper</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-black bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">&lt;10s</p>
                <p className="text-slate-600 text-xs font-semibold mt-1 uppercase tracking-widest">Analysis Time</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="text-center text-slate-700 text-xs pb-10 font-medium">
          © 2026 Autonomous Hypothesis Generator · Built for Researchers Worldwide
        </footer>
      </motion.div>
    </div>
  );
}