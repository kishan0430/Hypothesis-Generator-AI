import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileText, CheckCircle2, AlertCircle, Lightbulb } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 border border-blue-500 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
        <p className="text-blue-400 font-black text-[10px] uppercase tracking-widest mb-2 border-b border-slate-700 pb-2">{data.title}</p>
        <div className="space-y-1">
          <p className="text-white text-xs flex justify-between gap-10"><span className="text-slate-400">Feasibility:</span> <span className="text-green-400 font-bold">{data.feasibility}/10</span></p>
          <p className="text-white text-xs flex justify-between gap-10"><span className="text-slate-400">Impact:</span> <span className="text-blue-400 font-bold">{data.impact}/10</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalysisPage({ data }) {
  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] text-slate-500 space-y-6">
      <AlertCircle size={64} className="opacity-20 text-blue-500" />
      <h2 className="text-2xl font-bold text-slate-300 tracking-tight text-center">Ready for Analysis</h2>
      <p className="text-center">Upload a document in the <b>Research Lab</b> to see discovery proposals.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 max-w-7xl mx-auto space-y-8 bg-[#0a0c10] text-left">
      <header className="flex justify-between items-end border-b border-slate-800 pb-6">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2 tracking-tighter">SCIENTIFIC OUTPUT</h1>
          <p className="text-slate-400 italic">Advanced Gap Analysis & Discovery Proposals</p>
        </div>
        <div className="bg-blue-600/20 text-blue-400 px-4 py-2 rounded-xl border border-blue-500/20 flex items-center gap-2 text-sm font-bold">
           <CheckCircle2 size={16}/> Llama 3.3 Versatile
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
             <h3 className="text-[10px] font-black mb-4 flex items-center gap-2 text-blue-400 uppercase tracking-widest">Executive Summary</h3>
             <p className="text-slate-300 leading-relaxed text-lg italic">"{data.summary}"</p>
          </section>

          <section className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem]">
            <h3 className="text-[10px] font-black mb-6 flex items-center gap-2 text-blue-400 uppercase tracking-widest">Priority Matrix</h3>
            <div className="h-[400px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 20, right: 30, bottom: 20, left: 10 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis type="number" dataKey="feasibility" domain={[0, 10]} stroke="#475569" label={{ value: 'Feasibility', position: 'bottom', fill: '#475569', fontSize: 10, dy: 10 }} />
                  <YAxis type="number" dataKey="impact" domain={[0, 10]} stroke="#475569" label={{ value: 'Impact', angle: -90, position: 'left', fill: '#475569', fontSize: 10 }} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '6 6' }} />
                  <Scatter name="Hypotheses" data={data.hypotheses} fill="#3b82f6" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </section>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-bold px-2 text-white flex items-center gap-2"><Lightbulb className="text-blue-500" size={20}/> New Proposals</h3>
          <div className="h-[700px] overflow-y-auto pr-2 custom-scrollbar space-y-4">
            {data.hypotheses.map((h, i) => (
              <motion.div key={i} whileHover={{ x: 5 }} className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl border-l-4 border-l-blue-600 shadow-xl">
                <h4 className="font-bold text-white mb-3 text-lg">{h.title}</h4>
                <div className="mb-4">
                  <p className="text-[10px] text-blue-500 font-black uppercase tracking-widest mb-1">The Knowledge Gap</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{h.gap}</p>
                </div>
                <div>
                  <p className="text-[10px] text-green-500 font-black uppercase tracking-widest mb-1">The Hypothesis</p>
                  <p className="text-sm text-slate-300 italic">"{h.hypothesis}"</p>
                </div>
                <div className="flex gap-2 mt-5">
                  <span className="text-[10px] bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-bold">IMPACT: {h.impact}/10</span>
                  <span className="text-[10px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full font-bold">FEAS: {h.feasibility}/10</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}