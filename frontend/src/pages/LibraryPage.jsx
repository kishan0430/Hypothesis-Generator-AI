import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Search, Clock } from 'lucide-react';

export default function LibraryPage() {
  return (
    <div className="p-12 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-white">Research Library</h1>
        <div className="relative w-64">
           <Search size={18} className="absolute left-3 top-3 text-slate-500" />
           <input className="w-full bg-slate-900 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-sm" placeholder="Search archive..." />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3].map((item) => (
          <motion.div whileHover={{ y: -5 }} className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl flex gap-6 items-start opacity-50 grayscale hover:grayscale-0 transition-all cursor-not-allowed">
            <div className="bg-slate-800 p-4 rounded-2xl"><BookOpen className="text-slate-500" /></div>
            <div>
              <h3 className="text-lg font-bold text-slate-400">Previous Analysis #{item}</h3>
              <p className="text-slate-500 text-sm mb-4 italic leading-snug">Archived data visualization and hypothesis tracking.</p>
              <div className="flex items-center gap-2 text-[10px] text-slate-600 font-bold">
                <Clock size={12}/> DEC 29, 2025
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <p className="mt-10 text-center text-slate-600 font-mono text-xs uppercase tracking-widest italic">Database Sync coming in V2.0</p>
    </div>
  );
}