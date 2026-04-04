// src/pages/LoginPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill all fields'); return; }
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/app');
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm placeholder-black/25 focus:outline-none transition-all min-h-[48px] font-body";
  const inputStyle = {
    background: 'var(--surface-2)',
    border: '1px solid var(--border)',
    color: 'var(--text)',
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--bg)' }}>
      {/* Background accents */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, rgba(192,144,64,0.10) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="w-full max-w-[420px] relative z-10 rounded-2xl p-8 sm:p-10"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', boxShadow: '0 24px 80px rgba(16,14,9,0.10)' }}>

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-10 w-fit group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'var(--text)' }}>
            <Zap className="w-4 h-4" style={{ color: 'var(--bg)' }} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[19px]" style={{ color: 'var(--text)' }}>VibeKit</span>
        </Link>

        <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>Welcome back</h1>
        <p className="text-sm mb-8 font-body" style={{ color: 'var(--text-2)' }}>Sign in to your VibeKit Studio</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>Email</label>
            <input
              type="email" autoComplete="email"
              value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className={inputCls} style={inputStyle}
              onFocus={e => e.target.style.borderColor = 'rgba(16,14,9,0.45)'}
              onBlur={e => e.target.style.borderColor = 'var(--border)'}
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>Password</label>
            <div className="relative">
              <input
                type={showPw ? 'text' : 'password'} autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} pr-12`} style={inputStyle}
                onFocus={e => e.target.style.borderColor = 'rgba(16,14,9,0.45)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
                required
              />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors min-h-[44px] flex items-center"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                aria-label="Toggle password">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm glow-amber transition-all min-h-[48px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed font-body"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><ArrowRight className="w-4 h-4" /> Sign in</>
            )}
          </button>
        </form>

        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-center text-sm font-body" style={{ color: 'var(--text-3)' }}>
            No account yet?{' '}
            <Link to="/signup" className="font-semibold transition-colors hover:opacity-70" style={{ color: 'var(--text)' }}>
              Create one free →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}