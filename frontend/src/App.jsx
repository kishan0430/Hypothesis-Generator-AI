import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Beaker, Globe, Home, BrainCircuit, LogOut, Sparkles } from 'lucide-react';

// Import Pages
import HomePage from './pages/HomePage';
import LabPage from './pages/LabPage';
import AnalysisPage from './pages/AnalysisPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import BackgroundElements from './components/BackgroundElements';

export default function App() {
  const [analysisData, setAnalysisData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Router>
      <div className="flex h-screen bg-[#050608] text-slate-200 overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <BackgroundElements />

        {/* PREMIUM SIDEBAR */}
        <aside className="w-[280px] relative z-10 flex flex-col shrink-0">
          {/* Sidebar glass background */}
          <div className="absolute inset-0 bg-[#0a0c14]/80 backdrop-blur-2xl border-r border-white/[0.06]" />
          
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-indigo-600/[0.07] to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col h-full p-5">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-3 pt-2">
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/40 rounded-xl blur-md" />
                <motion.div 
                  className="relative bg-gradient-to-br from-indigo-500 to-violet-600 p-2.5 rounded-xl shadow-xl shadow-indigo-500/25"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <BrainCircuit size={24} className="text-white" />
                </motion.div>
              </div>
              <div>
                <p className="text-white font-extrabold text-lg leading-none tracking-tight">Autonomous</p>
                <p className="text-indigo-400 text-[9px] font-bold tracking-[0.25em] uppercase">Hypothesis Generator</p>
              </div>
            </div>

            {/* Model badge */}
            <div className="mx-3 mb-6">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-950/50 border border-indigo-500/20 text-indigo-300 text-[10px] font-semibold"
              >
                <Sparkles size={11} />
                LLaMA 3.3 · 70B Engine
              </motion.div>
            </div>

            {/* Navigation */}
            <nav className="space-y-1.5 flex-1">
              <SidebarNavigation />
            </nav>

            {/* Bottom section */}
            <div className="pt-4 border-t border-white/[0.04] space-y-3">
              <motion.button
                onClick={handleLogout}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.97 }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/[0.06] transition-all duration-300 text-sm font-medium"
              >
                <LogOut size={18} /> Sign Out
              </motion.button>

              <div className="px-4 py-3">
                <p className="text-[10px] text-slate-700 font-medium">© 2026 Autonomous Hypothesis Generator</p>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto relative z-0">
          <AnimatedRoutes
            analysisData={analysisData}
            setAnalysisData={setAnalysisData}
          />
        </main>
      </div>
    </Router>
  );
}

function SidebarNavigation() {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Welcome', to: '/' },
    { icon: Beaker, label: 'Research Lab', to: '/lab' },
    { icon: LayoutDashboard, label: 'Live Analysis', to: '/analysis' },
    { icon: Globe, label: 'About Platform', to: '/about' },
  ];

  return (
    <>
      {navItems.map((item) => {
        const isActive = location.pathname === item.to;
        return (
          <Link key={item.to} to={item.to}>
            <motion.div
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 text-sm font-medium ${
                isActive
                  ? 'text-white'
                  : 'text-slate-500 hover:text-slate-300 hover:bg-white/[0.03]'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-600/20 to-violet-600/10 border border-indigo-500/20"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              {isActive && (
                <motion.div
                  layoutId="activeAccent"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-gradient-to-b from-indigo-400 to-violet-500 rounded-full"
                  transition={{ type: "spring", stiffness: 350, damping: 30 }}
                />
              )}
              <item.icon size={18} className={`relative z-10 ${isActive ? 'text-indigo-400' : ''}`} />
              <span className="relative z-10">{item.label}</span>
            </motion.div>
          </Link>
        );
      })}
    </>
  );
}

function AnimatedRoutes({ analysisData, setAnalysisData }) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <HomePage />
            </motion.div>
          }
        />

        <Route
          path="/lab"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <LabPage setAnalysisData={setAnalysisData} />
            </motion.div>
          }
        />

        <Route
          path="/analysis"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnalysisPage data={analysisData} />
            </motion.div>
          }
        />

        <Route
          path="/about"
          element={
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            >
              <AboutPage />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
}