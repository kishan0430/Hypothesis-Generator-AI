import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Beaker, Globe, Settings, Home, BrainCircuit, LogOut } from 'lucide-react';

// Import Pages
import HomePage from './pages/HomePage';
import LabPage from './pages/LabPage';
import AnalysisPage from './pages/AnalysisPage';
import AboutPage from './pages/AboutPage';
import SettingsPage from './pages/SettingsPage';
import LoginPage from './pages/LoginPage'; // NEW IMPORT
import BackgroundElements from './components/BackgroundElements';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');

  // HANDLE LOGOUT
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
  };

  // If not logged in, show only the login page
  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#0a0c10] text-slate-200 overflow-hidden font-sans">
        <BackgroundElements />
        
        {/* SIDEBAR */}
        <aside className="w-72 bg-[#0f1117]/60 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-3 mb-10 px-2">
              <div className="bg-blue-600 p-2 rounded-lg shadow-lg shadow-blue-500/20"><BrainCircuit size={28} className="text-white" /></div>
              <h1 className="text-xl font-bold text-white leading-tight">Hypothesis <br/><span className="text-blue-500 tracking-tighter uppercase text-xs">Generator</span></h1>
            </div>
            <nav className="space-y-2">
              <SidebarNavigation />
            </nav>
          </div>

          <div className="space-y-2 pt-6 border-t border-slate-800/50">
            <Link to="/settings" className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-800/50 transition-all text-slate-400 hover:text-white"><Settings size={20} /> Settings</Link>
            
            {/* FUNCTIONAL LOGOUT BUTTON */}
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-red-500/10 text-slate-400 hover:text-red-400 transition-all"
            >
              <LogOut size={20} /> Logout
            </button>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative z-0">
          <AnimatedRoutes analysisData={analysisData} setAnalysisData={setAnalysisData} />
        </main>
      </div>
    </Router>
  );
}

// Keep your SidebarNavigation and AnimatedRoutes from the previous steps below...
function SidebarNavigation() {
  const location = useLocation();
  const SidebarItem = ({ icon: Icon, label, to, isActive }) => (
    <Link to={to} className={`flex items-center gap-3 p-3 rounded-xl transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'}`}>
      <Icon size={20} /> <span className="font-medium">{label}</span>
    </Link>
  );
  return (
    <>
      <SidebarItem icon={Home} label="Welcome" to="/" isActive={location.pathname === '/'} />
      <SidebarItem icon={Beaker} label="Research Lab" to="/lab" isActive={location.pathname === '/lab'} />
      <SidebarItem icon={LayoutDashboard} label="Live Analysis" to="/analysis" isActive={location.pathname === '/analysis'} />
      <SidebarItem icon={Globe} label="About Platform" to="/about" isActive={location.pathname === '/about'} />
    </>
  );
}

function AnimatedRoutes({ analysisData, setAnalysisData }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.4}}><HomePage /></motion.div>} />
        <Route path="/lab" element={<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.4}}><LabPage setAnalysisData={setAnalysisData} /></motion.div>} />
        <Route path="/analysis" element={<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.4}}><AnalysisPage data={analysisData} /></motion.div>} />
        <Route path="/about" element={<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.4}}><AboutPage /></motion.div>} />
        <Route path="/settings" element={<motion.div initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} transition={{duration:0.4}}><SettingsPage /></motion.div>} />
      </Routes>
    </AnimatePresence>
  );
}