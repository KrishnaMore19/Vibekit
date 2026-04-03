// src/pages/LandingPage.jsx
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { ArrowRight, Zap, Globe, Palette, Layers, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { THEMES } from '../themes';

// ─── Background — grid + amber glow ──────────────────────────────────────────
function Background() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden>
      {/* Grid */}
      <div className="absolute inset-0 bg-grid opacity-100" />
      {/* Amber center glow */}
      <div className="absolute top-[-15%] left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[120px]"
        style={{ background: 'radial-gradient(ellipse, rgba(245,166,35,0.09) 0%, transparent 70%)' }} />
      {/* Corner accents */}
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(245,100,35,0.06) 0%, transparent 70%)' }} />
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full blur-[100px]"
        style={{ background: 'radial-gradient(circle, rgba(245,166,35,0.05) 0%, transparent 70%)' }} />
    </div>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────
function Navbar() {
  const { user } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', h);
    return () => window.removeEventListener('scroll', h);
  }, []);

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled ? 'glass border-b border-white/[0.07] py-3' : 'py-5'
    }`}>
      <nav className="max-w-6xl mx-auto px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f5a623, #c47d0e)' }}>
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold text-[17px] tracking-tight text-white">VibeKit</span>
        </Link>

        {/* Links */}
        <div className="hidden sm:flex items-center gap-8 text-sm" style={{ color: 'var(--text-2)' }}>
          {['Themes', 'Features', 'How It Works'].map((l, i) => (
            <a key={l} href={['#themes','#features','#how'][i]}
              className="hover:text-white transition-colors duration-150 font-medium">{l}</a>
          ))}
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3">
          {user ? (
            <Link to="/app"
              className="px-4 py-2 rounded-lg text-sm font-semibold text-black transition-all min-h-[40px] flex items-center"
              style={{ background: 'var(--amber)' }}>
              Dashboard →
            </Link>
          ) : (
            <>
              <Link to="/login"
                className="text-sm font-medium transition-colors hidden sm:block"
                style={{ color: 'var(--text-2)' }}
                onMouseEnter={e => e.target.style.color='var(--text)'}
                onMouseLeave={e => e.target.style.color='var(--text-2)'}>
                Sign in
              </Link>
              <Link to="/signup"
                className="px-4 py-2.5 rounded-lg text-sm font-semibold text-black glow-amber transition-all min-h-[40px] flex items-center"
                style={{ background: 'var(--amber)' }}>
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const { user } = useAuth();

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-5 pt-24 pb-16">

      {/* Pill badge */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="mb-8">
        <span className="section-tag">
          <Sparkles className="w-3 h-3" />
          Generate · Build · Publish
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="font-display font-bold leading-[0.93] tracking-tight mb-6"
        style={{ fontSize: 'clamp(3rem, 9vw, 7.5rem)' }}>
        Your vibe,<br />
        <span className="gradient-text">your website.</span><br />
        <span style={{ color: 'var(--text-3)' }}>Published.</span>
      </motion.h1>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
        className="max-w-lg mx-auto mb-10 text-lg sm:text-xl leading-relaxed"
        style={{ color: 'var(--text-2)' }}>
        Pick a vibe preset, build your mini-site with our live editor, and ship it live in minutes — no code needed.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-3 items-center">
        <Link to={user ? '/app' : '/signup'}
          className="group flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-base text-black glow-amber transition-all min-h-[52px]"
          style={{ background: 'var(--amber)' }}>
          Create your first page
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </Link>
        <a href="#themes"
          className="flex items-center gap-2 px-8 py-4 glass rounded-xl font-semibold text-base transition-all min-h-[52px]"
          style={{ color: 'var(--text-2)' }}>
          Explore themes
        </a>
      </motion.div>

      {/* Stats strip */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.65 }}
        className="flex items-center gap-6 sm:gap-10 mt-14"
        style={{ color: 'var(--text-3)', fontSize: '12px' }}>
        {[['6', 'Unique Themes'], ['∞', 'Possible Pages'], ['1-click', 'Publish']].map(([n, l]) => (
          <div key={l} className="flex flex-col items-center gap-0.5">
            <span className="font-display font-bold text-xl" style={{ color: 'var(--amber)' }}>{n}</span>
            <span className="font-medium tracking-wide uppercase text-[10px]">{l}</span>
          </div>
        ))}
      </motion.div>

      {/* Scroll cue */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        style={{ color: 'var(--text-3)' }}>
        <span className="font-mono text-[10px] tracking-widest uppercase">scroll</span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}

// ─── Theme Showcase ───────────────────────────────────────────────────────────
const SHOWCASE_THEMES = ['minimal', 'darkneon', 'neobrutalist', 'luxury', 'pastel', 'retro'];

function ThemeCard({ themeId, index }) {
  const theme = THEMES[themeId];
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  const bgMap = {
    minimal:      'linear-gradient(135deg, #FAFAFA 0%, #F0F0F0 100%)',
    neobrutalist: 'linear-gradient(135deg, #F5F500 0%, #E0E000 100%)',
    darkneon:     'linear-gradient(135deg, #080818 0%, #0F0F2A 100%)',
    pastel:       'linear-gradient(135deg, #FDF0F8 0%, #F0E0FF 100%)',
    luxury:       'linear-gradient(135deg, #0A0A0A 0%, #1A1510 100%)',
    retro:        'linear-gradient(135deg, #001100 0%, #002200 100%)',
  };
  const accent = theme.preview.accent;
  const text   = theme.preview.text;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.48, delay: index * 0.07 }}
      className="group relative overflow-hidden rounded-2xl card-lift cursor-pointer"
      style={{
        border: '1px solid var(--border)',
        minHeight: '200px',
        background: 'var(--surface)',
      }}
    >
      {/* Simulated page preview */}
      <div className="absolute inset-0 p-4 flex flex-col gap-2.5"
        style={{ background: bgMap[themeId] }}>
        {/* Fake nav */}
        <div className="flex items-center gap-2">
          <div className="w-14 h-2 rounded-full opacity-70" style={{ background: accent }} />
          <div className="flex-1" />
          <div className="w-8 h-1.5 rounded-full opacity-30" style={{ background: text }} />
          <div className="w-8 h-1.5 rounded-full opacity-30" style={{ background: text }} />
        </div>
        {/* Fake hero */}
        <div className="flex-1 flex flex-col justify-center gap-2 px-1">
          <div className="h-4 rounded opacity-80"
            style={{ background: text, width: '65%', borderRadius: theme.vars['--vk-radius'] }} />
          <div className="h-2 rounded opacity-35"
            style={{ background: text, width: '88%' }} />
          <div className="h-2 rounded opacity-25"
            style={{ background: text, width: '72%' }} />
          <div className="h-6 rounded mt-1.5 opacity-90"
            style={{ background: accent, width: '38%', borderRadius: theme.vars['--vk-btn-radius'] || theme.vars['--vk-radius'] }} />
        </div>
        {/* Fake feature grid */}
        <div className="grid grid-cols-3 gap-1.5">
          {[0, 1, 2].map(j => (
            <div key={j} className="h-8 rounded opacity-20"
              style={{ background: accent, borderRadius: theme.vars['--vk-radius'] }} />
          ))}
        </div>
      </div>

      {/* Hover overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-all duration-250"
        style={{ background: 'linear-gradient(to top, rgba(6,6,8,0.92) 0%, rgba(6,6,8,0.5) 60%, transparent 100%)' }}>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display font-bold text-sm text-white">{theme.emoji} {theme.name}</p>
            <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-3)' }}>{theme.description}</p>
          </div>
          <div className="flex gap-1">
            {[theme.preview.bg, theme.preview.accent, theme.preview.text].map((c, i) => (
              <div key={i} className="w-4 h-4 rounded-full border border-white/20" style={{ background: c }} />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────────
const STEPS = [
  { icon: Palette, n: '01', title: 'Pick your vibe', desc: 'Choose from 6 crafted theme presets — minimal editorial to retro pixel.' },
  { icon: Layers,  n: '02', title: 'Build your page', desc: 'Edit hero, features, gallery, and contact with live preview on any screen size.' },
  { icon: Globe,   n: '03', title: 'Publish instantly', desc: 'One click to go live. Share your public URL and track view counts in real time.' },
];

function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="how" ref={ref} className="py-28 px-5 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="text-center mb-16">
        <span className="section-tag mb-5 inline-flex">Process</span>
        <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-4">
          Three steps to <span className="gradient-text">live</span>
        </h2>
        <p className="text-lg max-w-sm mx-auto" style={{ color: 'var(--text-2)' }}>
          From idea to published in under 5 minutes.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {STEPS.map(({ icon: Icon, n, title, desc }, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: i * 0.14 }}
            className="glass rounded-2xl p-6 relative group card-lift"
            style={{ borderColor: 'var(--border)' }}>
            {/* Big number watermark */}
            <div className="absolute top-4 right-5 font-display font-bold text-5xl leading-none select-none"
              style={{ color: 'rgba(245,166,35,0.07)' }}>{n}</div>
            {/* Icon */}
            <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
              style={{ background: 'rgba(245,166,35,0.1)', border: '1px solid rgba(245,166,35,0.2)' }}>
              <Icon className="w-5 h-5" style={{ color: 'var(--amber)' }} />
            </div>
            <h3 className="font-display text-lg font-bold mb-2">{title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--text-2)' }}>{desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  'Live preview — Desktop / Tablet / Mobile',
  '6 unique vibe theme presets',
  'Custom slug with collision handling',
  'View count tracking on published pages',
  'Contact form with DB persistence',
  'Auto-save with visual indicator',
  'Duplicate pages to iterate fast',
  'Secure JWT authentication',
  'PostgreSQL-backed persistence',
  'Serverless API via Netlify Functions',
  'Mobile-first responsive design',
  'Publish / Unpublish with one click',
];

function Features() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="features" ref={ref} className="py-28 px-5">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          className="text-center mb-14">
          <span className="section-tag mb-5 inline-flex">Features</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-3">
            Everything you need,{' '}
            <span className="gradient-text-warm">nothing you don't</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {FEATURES.map((feature, i) => (
            <motion.div key={i}
              initial={{ opacity: 0, x: -8 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ delay: i * 0.035 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-colors"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(245,166,35,0.2)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(245,166,35,0.12)', border: '1px solid rgba(245,166,35,0.28)' }}>
                <Check className="w-2.5 h-2.5" style={{ color: 'var(--amber)' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'var(--text-2)' }}>{feature}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTA() {
  const { user } = useAuth();
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-24 px-5">
      <motion.div initial={{ opacity: 0, y: 28 }} animate={inView ? { opacity: 1, y: 0 } : {}}
        className="max-w-3xl mx-auto text-center rounded-3xl p-12 sm:p-16 relative overflow-hidden"
        style={{
          background: 'var(--surface)',
          border: '1px solid rgba(245,166,35,0.15)',
          boxShadow: '0 0 80px rgba(245,166,35,0.06)',
        }}>
        {/* Inner amber glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse at 50% -10%, rgba(245,166,35,0.12) 0%, transparent 65%)' }} />
        <div className="relative z-10">
          <h2 className="font-display text-4xl sm:text-6xl font-bold mb-4">
            Ready to build your <span className="gradient-text">vibe?</span>
          </h2>
          <p className="text-lg mb-10" style={{ color: 'var(--text-2)' }}>Free to start. No credit card required.</p>
          <Link to={user ? '/app' : '/signup'}
            className="inline-flex items-center gap-2 px-10 py-4 rounded-xl font-bold text-lg text-black glow-amber transition-all min-h-[52px]"
            style={{ background: 'var(--amber)' }}>
            {user ? 'Go to Dashboard' : 'Create your first page'}
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </motion.div>
    </section>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="border-t py-10 px-5" style={{ borderColor: 'var(--border)' }}>
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
        style={{ color: 'var(--text-3)' }}>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #f5a623, #c47d0e)' }}>
            <Zap className="w-3 h-3 text-black" strokeWidth={2.5} />
          </div>
          <span className="font-display font-bold" style={{ color: 'var(--text-2)' }}>VibeKit Studio</span>
        </div>
        <p>Built with React · Tailwind · Framer Motion · PostgreSQL</p>
        <p>© {new Date().getFullYear()} VibeKit Studio</p>
      </div>
    </footer>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  return (
    <div className="relative">
      <Background />
      <Navbar />
      <Hero />

      {/* Theme showcase */}
      <section id="themes" className="py-24 px-5 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="section-tag mb-5 inline-flex">Themes</span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mt-4 mb-3">
            6 vibes. Infinite possibilities.
          </h2>
          <p className="text-lg" style={{ color: 'var(--text-2)' }}>
            Each theme is a complete design system — fonts, colors, spacing, and more.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SHOWCASE_THEMES.map((id, i) => (
            <ThemeCard key={id} themeId={id} index={i} />
          ))}
        </div>
      </section>

      <HowItWorks />
      <Features />
      <CTA />
      <Footer />
    </div>
  );
}