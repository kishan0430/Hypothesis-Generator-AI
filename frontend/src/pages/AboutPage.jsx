import React from 'react';
import { motion } from 'framer-motion';
import { Target, Cpu, Beaker, Users, Globe, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="p-12 max-w-5xl mx-auto space-y-16"
    >
      {/* Hero Section */}
      <section className="text-center space-y-4">
        <h1 className="text-5xl font-black text-white">Our Mission</h1>
        <p className="text-xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
          Hypothesis Generator was built to solve the "Knowledge Bottleneck." Every year, millions of scientific papers are published, making it impossible for humans to track every gap. We use advanced LLMs to bridge those gaps and spark the next generation of breakthroughs.
        </p>
      </section>

      {/* Grid of Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <AboutCard 
          icon={Cpu} 
          title="Neural Engine" 
          desc="Powered by Gemini 2.5 Flash, our engine processes complex scientific terminology and cross-references data in real-time." 
        />
        <AboutCard 
          icon={Target} 
          title="Gap Identification" 
          desc="Our proprietary algorithms scan for contradictions and missing experimental links that human eyes might overlook." 
        />
        <AboutCard 
          icon={Beaker} 
          title="Rigorous Metrics" 
          desc="Hypotheses aren't just generated; they are ranked by technical feasibility and potential societal impact." 
        />
        <AboutCard 
          icon={ShieldCheck} 
          title="Ethical AI" 
          desc="We prioritize data privacy. Your research stays your research. No data is used for training without explicit consent." 
        />
      </div>

      {/* Methodology Section */}
      <section className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] space-y-6">
        <h2 className="text-3xl font-bold text-white flex items-center gap-3">
          <Globe className="text-blue-500" /> Global Impact
        </h2>
        <p className="text-slate-400 leading-relaxed italic">
          "By automating the literature review and hypothesis generation phase, we aim to reduce the time from 'Question' to 'Discovery' by up to 70%. Our platform is designed for researchers, PhD students, and R&D departments across the globe."
        </p>
      </section>

      <footer className="text-center text-slate-600 text-sm pb-10">
        © 2025 Hypothesis Generator Research Labs. All Rights Reserved.
      </footer>
    </motion.div>
  );
}

const AboutCard = ({ icon: Icon, title, desc }) => (
  <div className="p-8 rounded-3xl bg-slate-900/30 border border-slate-800/50 hover:border-blue-500/30 transition-all group">
    <div className="bg-blue-600/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
      <Icon className="text-blue-500" size={28} />
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-slate-500 leading-relaxed text-sm">{desc}</p>
  </div>
);