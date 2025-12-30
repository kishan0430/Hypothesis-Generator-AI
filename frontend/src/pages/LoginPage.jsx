import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BrainCircuit, Lock, Mail, ArrowRight } from 'lucide-react';

export default function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Industry Practice: In a real app, this would be an API call
    // For now, we simulate a successful login
    if (email && password) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      onLogin();
    } else {
      alert("Please enter any email and password to enter.");
    }
  };

  return (
    <div className="fixed inset-0 bg-[#0a0c10] z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }} 
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0f1117] border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden"
      >
        {/* Decorative Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-blue-600/20 rounded-full blur-[80px]" />

        <div className="relative z-10 text-center space-y-8">
          <div className="inline-flex bg-blue-600 p-4 rounded-3xl shadow-lg shadow-blue-500/20">
            <BrainCircuit size={40} className="text-white" />
          </div>
          
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h1>
            <p className="text-slate-500 mt-2">Sign in to your Hypothesis Engine</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-2 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  type="email" required
                  placeholder="name@university.edu"
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase ml-2 tracking-widest">Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-500" size={18} />
                <input 
                  type="password" required
                  placeholder="••••••••"
                  className="w-full bg-black/40 border border-slate-800 rounded-2xl py-3.5 pl-12 pr-4 text-white outline-none focus:border-blue-500 transition-all"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all mt-4 group"
            >
              Enter Workspace <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          <p className="text-slate-600 text-xs">
            Access restricted to authorized research personnel.
          </p>
        </div>
      </motion.div>
    </div>
  );
}