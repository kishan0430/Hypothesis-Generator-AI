import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BrainCircuit, Lock, Mail, ArrowRight, UserPlus, LogIn, User, Sparkles, FlaskConical, Microscope, Atom } from 'lucide-react';

/* ── Animated Particle / Neural-network Canvas ── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const NUM = 70;
    const particles = Array.from({ length: NUM }, () => ({
      x:     Math.random() * canvas.width,
      y:     Math.random() * canvas.height,
      r:     Math.random() * 2 + 1,
      dx:    (Math.random() - 0.5) * 0.45,
      dy:    (Math.random() - 0.5) * 0.45,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx   = particles[i].x - particles[j].x;
          const dy   = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 130) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.18 * (1 - dist / 130)})`;
            ctx.lineWidth   = 0.8;
            ctx.stroke();
          }
        }
      }

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
        ctx.fill();
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width)  p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

/* ── Breathing orb ── */
const Orb = ({ className, delay = 0 }) => (
  <motion.div
    className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
    animate={{ scale: [1, 1.15, 1], opacity: [0.45, 0.75, 0.45] }}
    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay }}
  />
);

/* ── Feature card on left panel ── */
const FeatureCard = ({ icon: Icon, title, desc, delay }) => (
  <motion.div
    initial={{ opacity: 0, x: -30 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.6, ease: 'easeOut' }}
    className="flex items-start gap-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-4 hover:bg-white/10 transition-all"
  >
    <div className="bg-indigo-500/20 p-2.5 rounded-xl border border-indigo-400/20 shrink-0">
      <Icon size={20} className="text-indigo-300" />
    </div>
    <div>
      <p className="text-white font-semibold text-sm">{title}</p>
      <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{desc}</p>
    </div>
  </motion.div>
);

/* ── Input field ── */
const InputField = ({ icon: Icon, label, type, placeholder, value, onChange }) => {
  const [focused, setFocused] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.18em]">{label}</label>
      <div className={`relative flex items-center rounded-2xl border transition-all duration-300 ${
        focused
          ? 'border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)] bg-indigo-950/30'
          : 'border-white/8 bg-white/[0.04] hover:border-white/15'
      }`}>
        <Icon size={16} className={`absolute left-4 transition-colors ${focused ? 'text-indigo-400' : 'text-slate-600'}`} />
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="w-full bg-transparent py-3.5 pl-11 pr-4 text-white text-sm placeholder-slate-700 outline-none"
        />
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function LoginPage({ onLogin }) {
  const [isSignUp, setIsSignUp]   = useState(false);
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [fullName, setFullName]   = useState('');
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);

  const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!validateEmail(email))          { setError('Please enter a valid email address.'); return; }
    if (password.length < 6)            { setError('Password must be at least 6 characters.'); return; }
    if (isSignUp && !fullName.trim())   { setError('Please enter your full name.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); onLogin(); }, 1200);
  };

  return (
    <div className="fixed inset-0 flex bg-[#080a0f] overflow-hidden" style={{ fontFamily: "'Inter', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* ════════ LEFT PANEL ════════ */}
      <div className="w-[52%] relative flex flex-col justify-between p-14 overflow-hidden shrink-0">
        <ParticleCanvas />

        {/* Background orbs */}
        <Orb className="w-96 h-96 bg-indigo-600/20 -top-24 -left-24" delay={0} />
        <Orb className="w-72 h-72 bg-violet-600/15 bottom-12 right-12"  delay={2} />
        <Orb className="w-56 h-56 bg-blue-600/10 top-1/2 left-1/3"      delay={4} />

        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 flex items-center gap-3"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/40 rounded-2xl blur-md" />
            <div className="relative bg-gradient-to-br from-indigo-500 to-violet-600 p-3 rounded-2xl shadow-xl shadow-indigo-500/30">
              <BrainCircuit size={28} className="text-white" />
            </div>
          </div>
          <div>
            <p className="text-white font-extrabold text-xl leading-none tracking-tight">Autonomous</p>
            <p className="text-indigo-400 text-[10px] font-bold tracking-[0.25em] uppercase">Hypothesis Generator</p>
          </div>
        </motion.div>

        {/* Hero text + cards */}
        <div className="relative z-10 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            {/* Pill */}
            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-semibold backdrop-blur-sm"
            >
              <Sparkles size={12} />
              Powered by LLaMA 3.3 · 70B Parameters
            </motion.div>

            <h2 className="text-[3.2rem] font-black text-white leading-[1.08] tracking-tight">
              Discover the<br />
              <span className="bg-gradient-to-r from-indigo-400 via-violet-300 to-blue-400 bg-clip-text text-transparent">
                Next Frontier
              </span><br />
              of Science
            </h2>
            <p className="text-slate-400 mt-4 text-[15px] leading-relaxed max-w-sm">
              Upload any research paper and let AI uncover hidden knowledge gaps and generate groundbreaking hypotheses in seconds.
            </p>
          </motion.div>

          {/* Feature cards */}
          <div className="space-y-3">
            <FeatureCard icon={Atom}       title="AI Gap Analysis"      desc="Identifies unexplored research areas with precision."       delay={0.4} />
            <FeatureCard icon={FlaskConical} title="5 Unique Hypotheses" desc="Generates testable, high-impact research proposals."        delay={0.55} />
            <FeatureCard icon={Microscope} title="Priority Matrix"      desc="Ranks each hypothesis by impact & feasibility scores."     delay={0.7} />
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="relative z-10 text-slate-700 text-xs"
        >
          © 2026 Autonomous Hypothesis Generator · Built for Researchers
        </motion.p>
      </div>

      {/* ════════ RIGHT PANEL ════════ */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        {/* Right-side subtle glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/25 via-transparent to-violet-950/15 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[420px] relative z-10"
        >
          {/* Glass card */}
          <div className="relative">
            {/* Gradient border */}
            <div className="absolute -inset-[1px] rounded-[2.2rem] bg-gradient-to-br from-indigo-600/30 via-violet-600/15 to-transparent" />

            <div className="relative bg-[#0c0e18]/90 backdrop-blur-2xl rounded-[2.2rem] p-10 shadow-[0_30px_80px_rgba(0,0,0,0.5)]">
              {/* Top accent line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent rounded-full" />

              {/* Heading */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={isSignUp ? 'su' : 'li'}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="mb-8"
                >
                  <div className="relative w-[52px] h-[52px] mb-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl blur-md opacity-60" />
                    <div className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-xl">
                      {isSignUp ? <UserPlus size={24} className="text-white" /> : <LogIn size={24} className="text-white" />}
                    </div>
                  </div>
                  <h1 className="text-[1.9rem] font-black text-white tracking-tight leading-tight">
                    {isSignUp ? 'Join the Lab' : 'Welcome Back'}
                  </h1>
                  <p className="text-slate-500 text-sm mt-1.5">
                    {isSignUp ? 'Create your researcher account to begin.' : 'Sign in to your discovery engine.'}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatePresence>
                  {isSignUp && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <InputField icon={User} label="Full Name" type="text" placeholder="Dr. Jane Doe"
                        value={fullName} onChange={(e) => setFullName(e.target.value)} />
                    </motion.div>
                  )}
                </AnimatePresence>

                <InputField icon={Mail} label="Email Address" type="email" placeholder="name@university.edu"
                  value={email} onChange={(e) => setEmail(e.target.value)} />

                <InputField icon={Lock} label="Password" type="password" placeholder="Min. 6 characters"
                  value={password} onChange={(e) => setPassword(e.target.value)} />

                {/* Error */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="bg-red-950/50 border border-red-500/30 rounded-xl px-4 py-3">
                        <p className="text-red-400 text-xs font-medium">{error}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Submit */}
                <div className="pt-1">
                  <div className="relative group">
                    <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-500 opacity-80 group-hover:opacity-100 blur-sm transition-opacity" />
                    <motion.button
                      type="submit"
                      whileTap={{ scale: 0.98 }}
                      disabled={loading}
                      className="relative w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2.5 transition-all overflow-hidden shadow-xl disabled:opacity-70"
                    >
                      {/* Shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -skew-x-12"
                        animate={{ x: ['-200%', '200%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: 'linear' }}
                      />
                      {loading ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 0.9, repeat: Infinity, ease: 'linear' }}
                            className="w-5 h-5 border-2 border-white/25 border-t-white rounded-full"
                          />
                          <span className="relative">Authenticating…</span>
                        </>
                      ) : (
                        <>
                          <span className="relative">{isSignUp ? 'Create Account' : 'Enter Workspace'}</span>
                          <ArrowRight size={17} className="relative" />
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </form>

              {/* Divider + toggle */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-white/5" />
                <span className="text-slate-700 text-xs">or</span>
                <div className="flex-1 h-px bg-white/5" />
              </div>

              <p className="text-center text-slate-500 text-sm">
                {isSignUp ? 'Already a researcher?' : "New to the platform?"}
                {' '}
                <button
                  onClick={() => { setIsSignUp(!isSignUp); setError(''); }}
                  className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors"
                >
                  {isSignUp ? 'Sign In' : 'Create Account'}
                </button>
              </p>

              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent rounded-full" />
            </div>
          </div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center justify-center gap-6 mt-6"
          >
            {['Secure Access', 'AI-Powered', 'Research Grade'].map((t) => (
              <span key={t} className="text-slate-600 text-[11px] flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-indigo-500/50 inline-block" />
                {t}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}