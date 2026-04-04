// src/pages/SignupPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Zap, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';

export default function SignupPage() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Email and password are required'); return; }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await signup(email, password, name || undefined);
      toast.success('Account created! Welcome to VibeKit 🎉');
      navigate('/app');
    } catch (err) {
      toast.error(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthColors = ['', '#dc2626', '#c09040', '#16a34a'];
  const strengthLabels = ['', 'Weak', 'Good', 'Strong'];

  const inputCls = "w-full px-4 py-3 rounded-xl text-sm placeholder-black/25 focus:outline-none transition-all min-h-[48px] font-body";
  const inputStyle = { background: 'var(--surface-2)', border: '1px solid var(--border)', color: 'var(--text)' };
  const onFocus = e => e.target.style.borderColor = 'rgba(16,14,9,0.45)';
  const onBlur  = e => e.target.style.borderColor = 'var(--border)';

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative" style={{ background: 'var(--bg)' }}>
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="bg-grid absolute inset-0 opacity-60" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] blur-[120px]"
          style={{ background: 'radial-gradient(ellipse, rgba(192,144,64,0.10) 0%, transparent 70%)' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
        className="w-full max-w-[420px] relative z-10 rounded-2xl p-8 sm:p-10"
        style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', boxShadow: '0 24px 80px rgba(16,14,9,0.10)' }}>

        <Link to="/" className="flex items-center gap-2.5 mb-10 w-fit group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
            style={{ background: 'var(--text)' }}>
            <Zap className="w-4 h-4" style={{ color: 'var(--bg)' }} strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[19px]" style={{ color: 'var(--text)' }}>VibeKit</span>
        </Link>

        <h1 className="font-display text-3xl font-bold mb-1" style={{ color: 'var(--text)' }}>Create your account</h1>
        <p className="text-sm mb-8 font-body" style={{ color: 'var(--text-2)' }}>Start building beautiful pages today</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>
              Name <span style={{ color: 'var(--text-3)', textTransform: 'none', letterSpacing: 0 }}>(optional)</span>
            </label>
            <input type="text" autoComplete="name" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name" className={inputCls} style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>Email</label>
            <input type="email" autoComplete="email" value={email} onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com" className={inputCls} style={inputStyle}
              onFocus={onFocus} onBlur={onBlur} required />
          </div>

          <div>
            <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} autoComplete="new-password" value={password}
                onChange={e => setPassword(e.target.value)} placeholder="At least 8 characters"
                className={`${inputCls} pr-12`} style={inputStyle} onFocus={onFocus} onBlur={onBlur} required />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-colors min-h-[44px] flex items-center"
                style={{ color: 'var(--text-3)' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--text-3)'}
                aria-label="Toggle password">
                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {password.length > 0 && (
              <div className="mt-2 flex items-center gap-2">
                <div className="flex gap-1 flex-1">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-all duration-300"
                      style={{ background: i <= strength ? strengthColors[strength] : 'rgba(16,14,9,0.10)' }} />
                  ))}
                </div>
                <span className="text-xs font-semibold font-body" style={{ color: strengthColors[strength] }}>
                  {strengthLabels[strength]}
                </span>
              </div>
            )}
          </div>

          <button type="submit" disabled={loading}
            className="btn-primary flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm glow-amber transition-all min-h-[48px] mt-1 disabled:opacity-50 disabled:cursor-not-allowed font-body"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}>
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <><ArrowRight className="w-4 h-4" /> Create free account</>
            )}
          </button>
        </form>

        <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--border)' }}>
          <p className="text-center text-sm font-body" style={{ color: 'var(--text-3)' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:opacity-70 transition-opacity" style={{ color: 'var(--text)' }}>
              Sign in →
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}