import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, FileText, CheckCircle2, AlertCircle, Lightbulb, Download, Sparkles, Target, Zap } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const COLORS = ['#6366f1', '#8b5cf6', '#3b82f6', '#06b6d4', '#a855f7'];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#0c0e18]/95 backdrop-blur-xl border border-indigo-500/30 p-5 rounded-2xl shadow-2xl">
        <p className="text-indigo-300 font-black text-[10px] uppercase tracking-widest mb-3 border-b border-white/[0.06] pb-2">{data.title}</p>
        <div className="space-y-2">
          <p className="text-white text-xs flex justify-between gap-10"><span className="text-slate-500">Feasibility:</span> <span className="text-emerald-400 font-bold">{data.feasibility}/10</span></p>
          <p className="text-white text-xs flex justify-between gap-10"><span className="text-slate-500">Impact:</span> <span className="text-indigo-400 font-bold">{data.impact}/10</span></p>
        </div>
      </div>
    );
  }
  return null;
};

export default function AnalysisPage({ data }) {
  const handleDownload = () => {
    try {
      if (!data) return;
      const doc = new jsPDF();
      
      doc.setFontSize(22);
      doc.setTextColor(40, 40, 40);
      doc.text("Scientific Analysis Report", 14, 20);
      
      doc.setFontSize(11);
      doc.setTextColor(80, 80, 80);
      const splitSummary = doc.splitTextToSize(`Executive Summary: ${data.summary || ''}`, 180);
      doc.text(splitSummary, 14, 30);
      
      const tableData = data.hypotheses.map(h => [
        String(h.title || ''), 
        String(h.gap || ''), 
        String(h.hypothesis || ''), 
        String(h.impact || ''), 
        String(h.feasibility || '')
      ]);

      autoTable(doc, {
        startY: 30 + (splitSummary.length * 6) + 5,
        head: [['Title', 'Knowledge Gap', 'Hypothesis', 'Impact', 'Feasibility']],
        body: tableData,
        theme: 'grid',
        headStyles: { fillColor: [99, 102, 241] },
        styles: { fontSize: 8, cellPadding: 3 },
        columnStyles: {
          0: { cellWidth: 35 },
          1: { cellWidth: 45 },
          2: { cellWidth: 70 },
          3: { cellWidth: 15 },
          4: { cellWidth: 15 }
        }
      });

      doc.save("scientific_analysis_report.pdf");
    } catch (err) {
      console.error("PDF generation error: ", err);
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
      const a = document.createElement('a');
      a.setAttribute("href", dataStr);
      a.setAttribute("download", "scientific_analysis.json");
      document.body.appendChild(a);
      a.click();
      a.remove();
    }
  };

  if (!data) return (
    <div className="flex flex-col items-center justify-center min-h-[85vh] space-y-6">
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-indigo-500/20 rounded-3xl blur-xl" />
          <div className="relative bg-[#0c0e18] border border-white/[0.06] rounded-3xl p-8">
            <AlertCircle size={48} className="text-indigo-500/40" />
          </div>
        </div>
      </motion.div>
      <h2 className="text-2xl font-black text-white tracking-tight text-center">Ready for Analysis</h2>
      <p className="text-slate-500 text-center max-w-sm">Upload a document in the <b className="text-indigo-400">Research Lab</b> to see discovery proposals.</p>
    </div>
  );

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-8 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <header className="flex justify-between items-end pb-6 border-b border-white/[0.04]">
        <div>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-[0.3em] mb-2">Research Output</p>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Scientific <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Analysis</span>
            </h1>
          </motion.div>
        </div>
        <div className="flex items-center gap-3">
          <motion.button 
            onClick={handleDownload}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#0c0e18] border border-white/[0.08] hover:border-indigo-500/30 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-bold transition-all"
          >
            <Download size={15} /> Export PDF
          </motion.button>
          <div className="flex items-center gap-2 bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 px-4 py-2.5 rounded-xl text-[11px] font-bold">
            <Sparkles size={13} /> LLaMA 3.3 · 70B
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative overflow-hidden"
          >
            <div className="absolute -inset-[1px] rounded-[1.8rem] bg-gradient-to-br from-indigo-600/15 via-transparent to-violet-600/10" />
            <div className="relative bg-[#0c0e18]/90 backdrop-blur-md border border-white/[0.04] p-7 rounded-[1.8rem]">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-indigo-600/[0.06] to-transparent rounded-bl-full" />
              <h3 className="text-[10px] font-black mb-4 flex items-center gap-2 text-indigo-400 uppercase tracking-[0.2em]">
                <FileText size={13} /> Executive Summary
              </h3>
              <p className="text-slate-300 leading-relaxed text-base italic relative z-10">"{data.summary}"</p>
            </div>
          </motion.section>

          {/* Chart card */}
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="relative overflow-hidden"
          >
            <div className="absolute -inset-[1px] rounded-[1.8rem] bg-gradient-to-br from-indigo-600/10 via-transparent to-transparent" />
            <div className="relative bg-[#0c0e18]/90 backdrop-blur-md border border-white/[0.04] p-8 rounded-[1.8rem]">
              <h3 className="text-[10px] font-black mb-6 flex items-center gap-2 text-indigo-400 uppercase tracking-[0.2em]">
                <Target size={13} /> Priority Matrix
              </h3>
              <div className="h-[380px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <ScatterChart margin={{ top: 20, right: 30, bottom: 25, left: 10 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b30" vertical={false} />
                    <XAxis 
                      type="number" dataKey="feasibility" domain={[0, 10]} stroke="#334155" 
                      tick={{ fill: '#475569', fontSize: 11 }}
                      label={{ value: 'Feasibility →', position: 'bottom', fill: '#64748b', fontSize: 11, dy: 15 }} 
                    />
                    <YAxis 
                      type="number" dataKey="impact" domain={[0, 10]} stroke="#334155"
                      tick={{ fill: '#475569', fontSize: 11 }}
                      label={{ value: '← Impact', angle: -90, position: 'left', fill: '#64748b', fontSize: 11 }} 
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#6366f1', strokeWidth: 1, strokeDasharray: '6 6' }} />
                    <Scatter name="Hypotheses" data={data.hypotheses} fill="#6366f1">
                      {data.hypotheses.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} r={8} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>

              {/* Chart legend */}
              <div className="flex flex-wrap gap-3 mt-4 justify-center">
                {data.hypotheses.map((h, i) => (
                  <span key={i} className="flex items-center gap-2 text-[10px] text-slate-500">
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                    {h.title}
                  </span>
                ))}
              </div>
            </div>
          </motion.section>
        </div>

        {/* Right column - Hypotheses */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1 mb-2">
            <Lightbulb className="text-indigo-400" size={18} />
            <h3 className="text-lg font-black text-white tracking-tight">Discovery Proposals</h3>
          </div>
          
          <div className="h-[700px] overflow-y-auto pr-1 space-y-4 custom-scrollbar">
            {data.hypotheses.map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i }}
                whileHover={{ x: 4 }}
                className="relative group"
              >
                <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative bg-[#0c0e18]/80 backdrop-blur-md border border-white/[0.05] p-6 rounded-2xl overflow-hidden">
                  {/* Color accent bar */}
                  <div className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  
                  <h4 className="font-bold text-white mb-3 text-[15px] pl-3">{h.title}</h4>
                  
                  <div className="mb-3 pl-3">
                    <p className="text-[9px] text-indigo-400 font-black uppercase tracking-[0.2em] mb-1">Knowledge Gap</p>
                    <p className="text-sm text-slate-400 leading-relaxed">{h.gap}</p>
                  </div>
                  
                  <div className="pl-3">
                    <p className="text-[9px] text-emerald-400 font-black uppercase tracking-[0.2em] mb-1">Hypothesis</p>
                    <p className="text-sm text-slate-300 italic leading-relaxed">"{h.hypothesis}"</p>
                  </div>
                  
                  <div className="flex gap-2 mt-4 pl-3">
                    <span className="text-[10px] bg-indigo-500/15 text-indigo-300 px-3 py-1.5 rounded-lg font-bold border border-indigo-500/10">
                      IMPACT: {h.impact}/10
                    </span>
                    <span className="text-[10px] bg-white/[0.04] text-slate-400 px-3 py-1.5 rounded-lg font-bold border border-white/[0.05]">
                      FEAS: {h.feasibility}/10
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}