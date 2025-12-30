import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Shield, Zap, Database, Check, X, Save, Download } from 'lucide-react';

export default function SettingsPage() {
  // 1. STATE MANAGEMENT (Functional Logic)
  const [editingId, setEditingId] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  // Profile Data
  const [profile, setProfile] = useState({
    name: localStorage.getItem('user_name') || 'Dr. Researcher',
    institution: localStorage.getItem('user_inst') || 'Global Science Lab'
  });

  // AI Behavior
  const [temp, setTemp] = useState(localStorage.getItem('ai_temp') || 0.7);

  // API Key (Masked for security)
  const [apiKey, setApiKey] = useState(localStorage.getItem('GEMINI_API_KEY') || '••••••••••••••••');

  // 2. ACTIONS
  const handleSave = (id) => {
    if (id === 'profile') {
      localStorage.setItem('user_name', profile.name);
      localStorage.setItem('user_inst', profile.institution);
    } else if (id === 'api') {
      localStorage.setItem('GEMINI_API_KEY', apiKey);
    } else if (id === 'ai') {
      localStorage.setItem('ai_temp', temp);
    }

    setSaveStatus(id);
    setTimeout(() => {
      setSaveStatus(null);
      setEditingId(null);
    }, 1500);
  };

  const simulateDownload = (format) => {
    alert(`Generating ${format} export of your research history...`);
    // In a real app, this would call a backend route to generate a file.
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="p-12 max-w-4xl mx-auto space-y-12 text-left"
    >
      <header>
        <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Preferences</h1>
        <p className="text-slate-500 mt-2">Configure your scientific workspace environment.</p>
      </header>
      
      <div className="space-y-6">
        {/* --- ACADEMIC PROFILE --- */}
        <SettingCard 
          id="profile"
          icon={User} 
          title="Academic Profile" 
          desc="Manage your credentials and institution links."
          isEditing={editingId === 'profile'}
          onEdit={() => setEditingId('profile')}
          onCancel={() => setEditingId(null)}
          onSave={() => handleSave('profile')}
          status={saveStatus === 'profile'}
        >
          <div className="grid grid-cols-2 gap-4 pt-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input 
                value={profile.name} 
                onChange={(e) => setProfile({...profile, name: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase">Institution</label>
              <input 
                value={profile.institution} 
                onChange={(e) => setProfile({...profile, institution: e.target.value})}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
              />
            </div>
          </div>
        </SettingCard>

        {/* --- SECURITY & API --- */}
        <SettingCard 
          id="api"
          icon={Shield} 
          title="Security & API" 
          desc="Update your Gemini 2.5 API integration."
          active={true}
          isEditing={editingId === 'api'}
          onEdit={() => setEditingId('api')}
          onCancel={() => setEditingId(null)}
          onSave={() => handleSave('api')}
          status={saveStatus === 'api'}
        >
          <div className="pt-4 space-y-2">
             <label className="text-xs font-bold text-slate-500 uppercase">Gemini API Key</label>
             <input 
                type="password"
                value={apiKey} 
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste new key here..."
                className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-blue-500"
              />
              <p className="text-[10px] text-slate-500 italic">Changing this will update the .env configuration in real-time.</p>
          </div>
        </SettingCard>

        {/* --- AI BEHAVIOR --- */}
        <SettingCard 
          id="ai"
          icon={Zap} 
          title="AI Behavior" 
          desc="Control the temperature/creativity of the generator."
          isEditing={editingId === 'ai'}
          onEdit={() => setEditingId('ai')}
          onCancel={() => setEditingId(null)}
          onSave={() => handleSave('ai')}
          status={saveStatus === 'ai'}
        >
          <div className="pt-6 space-y-4">
            <div className="flex justify-between text-xs font-bold text-slate-400">
              <span>PRECISE (0.1)</span>
              <span>CREATIVE (1.0)</span>
            </div>
            <input 
              type="range" min="0.1" max="1.0" step="0.1" 
              value={temp} 
              onChange={(e) => setTemp(e.target.value)}
              className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
            />
            <p className="text-center text-blue-500 font-mono font-bold">Current Setting: {temp}</p>
          </div>
        </SettingCard>

        {/* --- DATA EXPORT --- */}
        <SettingCard 
          id="export"
          icon={Database} 
          title="Data Export" 
          desc="Download your analysis history for offline review."
          isEditing={editingId === 'export'}
          onEdit={() => setEditingId('export')}
          onCancel={() => setEditingId(null)}
          hideSave={true}
        >
          <div className="pt-4 flex gap-4">
            <button 
              onClick={() => simulateDownload('PDF')}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
            >
              <Download size={16}/> Export PDF
            </button>
            <button 
              onClick={() => simulateDownload('CSV')}
              className="flex-1 bg-slate-800 hover:bg-slate-700 border border-slate-700 p-3 rounded-xl flex items-center justify-center gap-2 font-bold text-sm transition-colors"
            >
              <Download size={16}/> Export CSV
            </button>
          </div>
        </SettingCard>
      </div>
    </motion.div>
  );
}

// 3. REUSABLE UI COMPONENT
const SettingCard = ({ icon: Icon, title, desc, children, isEditing, onEdit, onCancel, onSave, status, hideSave, active }) => (
  <div className={`p-6 rounded-[2rem] border transition-all duration-300 ${
    isEditing ? 'border-blue-500 bg-blue-500/5 ring-1 ring-blue-500/20' : 'border-slate-800 bg-slate-900/30'
  }`}>
    <div className="flex justify-between items-start">
      <div className="flex gap-4 items-center">
        <div className={`p-3 rounded-2xl ${active || isEditing ? 'bg-blue-600 shadow-lg shadow-blue-500/20' : 'bg-slate-800 text-slate-400'}`}>
          <Icon size={24} className={active || isEditing ? 'text-white' : ''} />
        </div>
        <div>
          <h3 className="font-bold text-white text-lg tracking-tight">{title}</h3>
          <p className="text-slate-500 text-sm leading-tight">{desc}</p>
        </div>
      </div>
      
      {!isEditing ? (
        <button 
          onClick={onEdit}
          className="text-blue-500 font-bold text-xs uppercase tracking-widest hover:text-white transition-colors py-2 px-4 bg-blue-500/10 rounded-full border border-blue-500/20"
        >
          Edit
        </button>
      ) : (
        <div className="flex gap-2">
           <button onClick={onCancel} className="p-2 text-slate-400 hover:text-white"><X size={20}/></button>
           {!hideSave && (
             <button 
               onClick={onSave} 
               className={`p-2 rounded-lg transition-all ${status ? 'bg-green-600' : 'bg-blue-600'} text-white shadow-lg shadow-blue-500/20`}
             >
               {status ? <Check size={20}/> : <Save size={20}/>}
             </button>
           )}
        </div>
      )}
    </div>

    <AnimatePresence>
      {isEditing && (
        <motion.div 
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="overflow-hidden"
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);