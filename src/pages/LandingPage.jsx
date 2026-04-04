// src/pages/LandingPage.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, ArrowRight, Globe, Edit3, Eye, Star, Sparkles, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { THEMES } from '../themes';

// ─── Theme Preview Card ────────────────────────────────────────────────────────
function ThemePreviewCard({ theme, delay = 0 }) {
  const v = theme.vars;
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="card-lift rounded-2xl overflow-hidden"
      style={{ border: '1px solid var(--border-hi)', boxShadow: '0 8px 32px rgba(16,14,9,0.08)' }}>
      {/* Mini preview */}
      <div className="h-44 relative overflow-hidden p-5 flex flex-col justify-between"
        style={{ background: v['--vk-bg'] }}>
        {/* Hero area */}
        <div>
          <div className="h-3 w-2/3 rounded-sm mb-2"
            style={{ background: v['--vk-text'], opacity: 0.85, borderRadius: v['--vk-radius'] }} />
          <div className="h-2 w-1/2 rounded-sm mb-4"
            style={{ background: v['--vk-text'], opacity: 0.30, borderRadius: v['--vk-radius'] }} />
          <div className="inline-block px-3 py-1.5 text-[10px] font-bold"
            style={{
              background: v['--vk-accent'],
              color: v['--vk-bg'],
              borderRadius: v['--vk-btn-radius'],
              boxShadow: v['--vk-shadow'],
            }}>
            CTA Button
          </div>
        </div>
        {/* Feature cards */}
        <div className="grid grid-cols-3 gap-1.5">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 rounded"
              style={{
                background: v['--vk-surface'],
                border: `1px solid ${v['--vk-border']}`,
                borderRadius: v['--vk-radius'],
              }} />
          ))}
        </div>
        {/* Overlay gradient */}
        <div className="absolute inset-x-0 bottom-0 h-8"
          style={{ background: `linear-gradient(to top, ${v['--vk-bg']}, transparent)` }} />
      </div>
      {/* Label */}
      <div className="px-4 py-3.5" style={{ background: 'var(--surface)', borderTop: '1px solid var(--border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-display font-semibold text-[15px]" style={{ color: 'var(--text)' }}>{theme.name}</p>
            <p className="text-xs font-body mt-0.5" style={{ color: 'var(--text-3)' }}>{theme.description}</p>
          </div>
          <span className="text-xl">{theme.emoji}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Steps ────────────────────────────────────────────────────────────────────
const steps = [
  { n: '01', title: 'Pick a Vibe', desc: 'Choose from 6 distinct design presets — minimal, neon, retro, and more.', icon: Sparkles },
  { n: '02', title: 'Build Your Page', desc: 'Edit your hero, features, gallery, and contact sections in real-time.', icon: Edit3 },
  { n: '03', title: 'Publish It', desc: 'One click to go live. Get a public URL you can share anywhere.', icon: Globe },
];

const features = [
  { title: '6 Unique Themes', desc: 'From brutalist to pastel luxury — pick the vibe that matches your brand.' },
  { title: 'Live Preview', desc: 'See your changes instantly across desktop, tablet, and mobile viewports.' },
  { title: 'One-Click Publish', desc: 'Go from draft to public URL in seconds. Unpublish anytime.' },
  { title: 'Auto-save', desc: 'Every keystroke is saved automatically. Never lose your work.' },
  { title: 'View Analytics', desc: 'Track how many people visit your published pages over time.' },
  { title: 'Secure Auth', desc: 'JWT-based sessions with bcrypt password hashing. Safe by default.' },
];

export default function LandingPage() {
  const { user, loading } = useAuth();
  const themeList = Object.values(THEMES);

  return (
    <div className="flex flex-col min-h-screen font-body" style={{ background: 'var(--bg)', color: 'var(--text)' }}>

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
              style={{ background: 'var(--text)' }}>
              <Zap className="w-4 h-4" style={{ color: 'var(--bg)' }} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-[18px]">VibeKit</span>
          </Link>
          {!loading && (
            <div className="flex items-center gap-3">
              {user ? (
                <Link to="/app"
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary glow-amber min-h-[44px]"
                  style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                  Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <>
                  <Link to="/login"
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] flex items-center"
                    style={{ color: 'var(--text-2)' }}
                    onMouseEnter={e => e.currentTarget.style.color = 'var(--text)'}
                    onMouseLeave={e => e.currentTarget.style.color = 'var(--text-2)'}>
                    Sign in
                  </Link>
                  <Link to="/signup"
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-semibold btn-primary glow-amber min-h-[44px]"
                    style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                    Get started
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative flex flex-col items-center justify-center text-center px-5 sm:px-8 pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-60 pointer-events-none" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[500px] blur-[140px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(192,144,64,0.12) 0%, transparent 65%)' }} />

        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="section-tag mb-6">
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--gold)' }} />
          Free to use · No credit card required
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="font-display text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.07] max-w-3xl mb-6 relative z-10">
          Generate a theme,{' '}
          <span className="relative inline-block">
            <span className="relative z-10" style={{
              background: 'linear-gradient(118deg, #100E09 10%, #C09040 55%, #100E09 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>build a mini-site</span>
            <span className="absolute bottom-1 left-0 right-0 h-[6px] rounded-full"
              style={{ background: 'rgba(192,144,64,0.22)', zIndex: 0 }} />
          </span>
          {', publish it.'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg sm:text-xl max-w-xl mb-10 relative z-10 leading-relaxed"
          style={{ color: 'var(--text-2)' }}>
          VibeKit Studio is the fastest way to build a polished, themed mini-site. Pick a vibe, customize your sections, and share with the world.
        </motion.p>

        {!loading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 relative z-10">
            {user ? (
              <Link to="/app"
                className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base btn-primary glow-amber min-h-[52px]"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link to="/signup"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base btn-primary glow-amber min-h-[52px]"
                  style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                  Create your first page <ArrowRight className="w-4 h-4" />
                </Link>
                <Link to="/login"
                  className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all min-h-[52px] card-lift"
                  style={{ border: '1px solid var(--border-hi)', color: 'var(--text-2)', background: 'var(--surface)' }}>
                  Sign in
                </Link>
              </>
            )}
          </motion.div>
        )}

        {/* Floating stat pills */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="flex flex-wrap justify-center gap-3 mt-10 relative z-10">
          {[['6', 'Design Themes'], ['4', 'Page Sections'], ['1-click', 'Publish']].map(([val, label]) => (
            <div key={label} className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: '0 2px 12px rgba(16,14,9,0.06)' }}>
              <span className="font-display font-bold text-sm">{val}</span>
              <span className="text-xs" style={{ color: 'var(--text-3)' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── Theme Showcase ───────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag mb-5 mx-auto w-fit">Themes</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">Six distinct vibes.</h2>
            <p className="text-base sm:text-lg max-w-lg mx-auto" style={{ color: 'var(--text-2)' }}>
              Every theme ships with a complete design system — colors, typography, spacing, and button styles.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {themeList.map((theme, i) => (
              <ThemePreviewCard key={theme.id} theme={theme} delay={i * 0.07} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag mb-5 mx-auto w-fit">Process</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">How it works</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, i) => (
              <motion.div key={s.n}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}
                className="relative p-6 rounded-2xl card-lift"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--text)' }}>
                  <s.icon className="w-4 h-4" style={{ color: 'var(--bg)' }} />
                </div>
                <span className="font-mono text-xs font-semibold" style={{ color: 'var(--gold)' }}>{s.n}</span>
                <h3 className="font-display text-xl font-bold mt-1 mb-2">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8" style={{ background: 'var(--bg-3)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="section-tag mb-5 mx-auto w-fit">Features</div>
            <h2 className="font-display text-4xl sm:text-5xl font-bold">Everything you need</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f, i) => (
              <motion.div key={f.title}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.4, delay: i * 0.07 }}
                className="p-5 rounded-2xl card-lift"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="w-2 h-2 rounded-full mb-3" style={{ background: 'var(--gold)' }} />
                <h3 className="font-display text-lg font-semibold mb-1.5">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Bottom ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-5 sm:px-8 text-center relative overflow-hidden"
        style={{ background: 'var(--text)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(192,144,64,0.15) 0%, transparent 60%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }} transition={{ duration: 0.6 }}
          className="relative z-10 max-w-xl mx-auto">
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4" style={{ color: 'var(--bg)' }}>
            Ready to vibe?
          </h2>
          <p className="text-base mb-10" style={{ color: 'rgba(247,243,236,0.55)' }}>
            Create your first page in under 2 minutes. Free forever.
          </p>
          {!loading && (
            user ? (
              <Link to="/app"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-base transition-all min-h-[52px] hover:opacity-90"
                style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <Link to="/signup"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-semibold text-base transition-all min-h-[52px] hover:opacity-90"
                style={{ background: 'var(--bg)', color: 'var(--text)' }}>
                Get started free <ArrowRight className="w-4 h-4" />
              </Link>
            )
          )}
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-5 sm:px-8" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center"
              style={{ background: 'var(--text)' }}>
              <Zap className="w-3 h-3" style={{ color: 'var(--bg)' }} strokeWidth={2.5} />
            </div>
            <span className="font-display font-bold text-sm">VibeKit</span>
          </div>
          <p className="text-xs font-body" style={{ color: 'var(--text-3)' }}>
            © {new Date().getFullYear()} VibeKit Studio · Built for Purple Merit Technologies Assessment
          </p>
        </div>
      </footer>
    </div>
  );
}