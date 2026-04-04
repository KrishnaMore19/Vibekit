// src/components/preview/ThemedPage.jsx
// Renders the full published/preview mini-site with all theme CSS variables applied

import { useState } from 'react';
import { THEMES, THEME_FONTS } from '../../themes';

// ─── Hero Section ──────────────────────────────────────────────────────────────
function HeroSection({ data, theme }) {
  return (
    <section id="hero" style={{
      padding: 'clamp(4rem, 8vw, 7rem) 1.5rem',
      background: 'var(--vk-hero-gradient, var(--vk-bg))',
      textAlign: 'center',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        <h1 style={{
          fontFamily: 'var(--vk-font-display)',
          fontSize: 'clamp(2rem, 5vw, 4rem)',
          fontWeight: '800',
          lineHeight: '1.1',
          marginBottom: '1.25rem',
          color: 'var(--vk-text)',
          letterSpacing: theme?.id === 'retro' ? '0.08em' : '-0.01em',
        }}>
          {data.title || 'Welcome to My Page'}
        </h1>
        <p style={{
          fontFamily: 'var(--vk-font-body)',
          fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
          color: 'var(--vk-text-muted)',
          marginBottom: '2.5rem',
          maxWidth: '560px',
          margin: '0 auto 2.5rem',
          lineHeight: '1.7',
        }}>
          {data.subtitle || 'A beautiful page built with VibeKit Studio'}
        </p>
        {data.buttonText && (
          <a
            href={data.buttonUrl || '#'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '0.875rem 2.5rem',
              background: 'var(--vk-accent)',
              color: 'var(--vk-btn-text, var(--vk-bg))',
              borderRadius: 'var(--vk-btn-radius)',
              textDecoration: 'none',
              fontFamily: 'var(--vk-font-body)',
              fontWeight: '700',
              fontSize: '1rem',
              boxShadow: 'var(--vk-shadow)',
              transition: 'opacity 0.2s ease, transform 0.15s ease',
              border: theme?.id === 'neobrutalist' ? '3px solid var(--vk-text)' : 'none',
              letterSpacing: '0.01em',
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            {data.buttonText}
          </a>
        )}
      </div>
    </section>
  );
}

// ─── Features Section ─────────────────────────────────────────────────────────
function FeaturesSection({ data }) {
  const features = Array.isArray(data) ? data : [];

  return (
    <section id="features" style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: 'var(--vk-surface)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--vk-font-display)',
          textAlign: 'center',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: '800',
          color: 'var(--vk-text)',
          marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
          letterSpacing: '-0.01em',
        }}>
          Features
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
        }}>
          {features.map((feature, i) => (
            <div
              key={feature.id || i}
              style={{
                padding: '1.75rem',
                background: 'var(--vk-bg)',
                borderRadius: 'var(--vk-radius)',
                border: '1px solid var(--vk-border)',
                boxShadow: 'var(--vk-shadow)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'var(--vk-shadow)';
              }}
            >
              <div style={{
                width: '40px', height: '40px',
                borderRadius: 'var(--vk-radius)',
                background: 'var(--vk-accent)',
                marginBottom: '1.25rem',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
              }}>
                <span style={{ color: 'var(--vk-btn-text, var(--vk-bg))', fontSize: '13px', fontWeight: '800', fontFamily: 'monospace' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
              </div>
              <h3 style={{
                fontFamily: 'var(--vk-font-display)',
                fontWeight: '700',
                fontSize: '1.1rem',
                color: 'var(--vk-text)',
                marginBottom: '0.6rem',
                lineHeight: '1.3',
              }}>
                {feature.title || 'Feature'}
              </h3>
              <p style={{
                fontFamily: 'var(--vk-font-body)',
                fontSize: '0.9rem',
                color: 'var(--vk-text-muted)',
                lineHeight: '1.7',
              }}>
                {feature.description || 'Description goes here.'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Gallery Section ──────────────────────────────────────────────────────────
function GallerySection({ data }) {
  const images = Array.isArray(data) ? data : [];
  const [lightbox, setLightbox] = useState(null);

  return (
    <section id="gallery" style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: 'var(--vk-bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--vk-font-display)',
          textAlign: 'center',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: '800',
          color: 'var(--vk-text)',
          marginBottom: 'clamp(2rem, 4vw, 3.5rem)',
          letterSpacing: '-0.01em',
        }}>
          Gallery
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '1rem',
        }}>
          {images.map((img, i) => (
            <div
              key={img.id || i}
              onClick={() => setLightbox(img)}
              style={{
                borderRadius: 'var(--vk-radius)',
                overflow: 'hidden',
                cursor: 'zoom-in',
                border: '1px solid var(--vk-border)',
                aspectRatio: '4/3',
                boxShadow: 'var(--vk-shadow)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
                position: 'relative',
              }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'scale(1.03)';
                e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = 'var(--vk-shadow)';
              }}
            >
              <img
                src={img.url}
                alt={img.alt || `Gallery image ${i + 1}`}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div
          onClick={() => setLightbox(null)}
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.92)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 9999, padding: '1.5rem', cursor: 'zoom-out',
          }}
        >
          <img
            src={lightbox.url} alt={lightbox.alt}
            style={{ maxWidth: '90vw', maxHeight: '88vh', objectFit: 'contain', borderRadius: '12px', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}
            onClick={e => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
}

// ─── Contact Section ──────────────────────────────────────────────────────────
function ContactSection({ data, slug, isPreview }) {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState('idle');
  const [errMsg, setErrMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isPreview) {
      alert('Contact form is disabled in preview mode. Publish your page to enable it.');
      return;
    }
    if (!form.name || !form.email || !form.message) return;
    setStatus('loading');
    try {
      const res = await fetch(`/api/public/pages/${slug}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json()).error || 'Failed to send');
      setStatus('success');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      setErrMsg(err.message);
      setStatus('error');
    }
  };

  const inputStyle = {
    display: 'block',
    width: '100%',
    padding: '0.75rem 1rem',
    background: 'var(--vk-bg)',
    border: '1px solid var(--vk-border)',
    borderRadius: 'var(--vk-radius)',
    color: 'var(--vk-text)',
    fontSize: '0.95rem',
    fontFamily: 'var(--vk-font-body)',
    outline: 'none',
    transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
    minHeight: '44px',
    boxSizing: 'border-box',
  };

  return (
    <section id="contact" style={{ padding: 'clamp(3rem, 6vw, 5rem) 1.5rem', background: 'var(--vk-surface)' }}>
      <div style={{ maxWidth: '580px', margin: '0 auto' }}>
        <h2 style={{
          fontFamily: 'var(--vk-font-display)',
          textAlign: 'center',
          fontSize: 'clamp(1.75rem, 3vw, 2.5rem)',
          fontWeight: '800',
          color: 'var(--vk-text)',
          marginBottom: '0.75rem',
          letterSpacing: '-0.01em',
        }}>
          {data.title || 'Get In Touch'}
        </h2>
        {data.subtitle && (
          <p style={{
            fontFamily: 'var(--vk-font-body)',
            textAlign: 'center',
            marginBottom: '2.5rem',
            fontSize: '1rem',
            color: 'var(--vk-text-muted)',
            lineHeight: '1.7',
          }}>
            {data.subtitle}
          </p>
        )}

        {status === 'success' ? (
          <div style={{
            textAlign: 'center', padding: '3rem',
            background: 'var(--vk-bg)',
            border: '2px solid var(--vk-accent)',
            borderRadius: 'var(--vk-radius)',
          }}>
            <p style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✅</p>
            <p style={{ fontFamily: 'var(--vk-font-display)', fontWeight: '700', fontSize: '1.25rem', color: 'var(--vk-text)' }}>
              Message Sent!
            </p>
            <p style={{ fontFamily: 'var(--vk-font-body)', color: 'var(--vk-text-muted)', marginTop: '0.5rem', fontSize: '0.9rem' }}>
              Thank you for reaching out. We'll get back to you soon.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'var(--vk-font-body)', color: 'var(--vk-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Name
                </label>
                <input type="text" required value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Your name" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--vk-accent)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--vk-accent) 15%, transparent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--vk-border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'var(--vk-font-body)', color: 'var(--vk-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Email
                </label>
                <input type="email" required value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  placeholder="you@example.com" style={inputStyle}
                  onFocus={e => { e.target.style.borderColor = 'var(--vk-accent)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--vk-accent) 15%, transparent)'; }}
                  onBlur={e => { e.target.style.borderColor = 'var(--vk-border)'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', fontFamily: 'var(--vk-font-body)', color: 'var(--vk-text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Message
              </label>
              <textarea
                required rows={5} value={form.message}
                onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                placeholder="Your message..."
                style={{ ...inputStyle, resize: 'vertical', minHeight: '130px' }}
                onFocus={e => { e.target.style.borderColor = 'var(--vk-accent)'; e.target.style.boxShadow = '0 0 0 3px color-mix(in srgb, var(--vk-accent) 15%, transparent)'; }}
                onBlur={e => { e.target.style.borderColor = 'var(--vk-border)'; e.target.style.boxShadow = 'none'; }}
              />
            </div>
            {status === 'error' && (
              <p style={{ color: '#ef4444', fontSize: '0.875rem', fontFamily: 'var(--vk-font-body)' }}>{errMsg}</p>
            )}
            <button
              type="submit"
              disabled={status === 'loading'}
              style={{
                padding: '0.875rem 2.5rem',
                background: 'var(--vk-accent)',
                color: 'var(--vk-btn-text, var(--vk-bg))',
                border: 'none',
                borderRadius: 'var(--vk-btn-radius)',
                fontSize: '1rem',
                fontWeight: '700',
                fontFamily: 'var(--vk-font-body)',
                cursor: status === 'loading' ? 'wait' : 'pointer',
                opacity: status === 'loading' ? 0.7 : 1,
                transition: 'opacity 0.2s, transform 0.15s',
                minHeight: '48px',
                boxShadow: 'var(--vk-shadow)',
                letterSpacing: '0.01em',
              }}
              onMouseEnter={e => { if (status !== 'loading') { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}}
              onMouseLeave={e => { e.currentTarget.style.opacity = status === 'loading' ? '0.7' : '1'; e.currentTarget.style.transform = 'translateY(0)'; }}
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── Full themed page ─────────────────────────────────────────────────────────
export default function ThemedPage({ page, isPreview = false }) {
  const theme = THEMES[page?.theme] || THEMES.minimal;
  const content = page?.content || {};
  const sectionOrder = content.sectionOrder || ['hero', 'features', 'gallery', 'contact'];

  // ✅ FIX: React doesn't support cssText on style prop.
  // Convert CSS vars object into a proper React style object using string keys.
  const cssVarStyle = Object.fromEntries(
    Object.entries(theme.vars || {}).map(([k, v]) => [k, v])
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const sectionMap = {
    hero: <HeroSection key="hero" data={content.hero || {}} theme={theme} />,
    features: <FeaturesSection key="features" data={content.features || []} />,
    gallery: <GallerySection key="gallery" data={content.gallery || []} />,
    contact: <ContactSection key="contact" data={content.contact || {}} slug={page?.slug} isPreview={isPreview} />,
  };

  const navSections = sectionOrder.filter(s => s !== 'hero');

  return (
    <>
      {/* Inject theme fonts */}
      <link rel="stylesheet" href={THEME_FONTS[page?.theme] || THEME_FONTS?.minimal} />

      {/* ✅ FIX: Use style object with CSS custom property keys — React handles these correctly */}
      <div style={{ ...cssVarStyle, minHeight: '100vh', fontFamily: 'var(--vk-font-body)', background: 'var(--vk-bg)', color: 'var(--vk-text)' }}>

        {/* ── Nav bar ───────────────────────────────────────────────────── */}
        <nav style={{
          padding: '0 1.5rem',
          background: 'var(--vk-surface)',
          borderBottom: '1px solid var(--vk-border)',
          position: 'sticky',
          top: 0,
          zIndex: 100,
          boxShadow: 'var(--vk-shadow)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: '60px' }}>
            <span style={{
              fontFamily: 'var(--vk-font-display)',
              fontWeight: '800',
              fontSize: '1.25rem',
              color: 'var(--vk-text)',
              letterSpacing: theme.id === 'retro' ? '0.1em' : '-0.01em',
              flexShrink: 0,
            }}>
              {page?.title}
            </span>

            {/* Desktop nav links (hidden on mobile) */}
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }} className="vk-nav-desktop">
              {navSections.map(s => (
                <a key={s} href={`#${s}`} style={{
                  fontFamily: 'var(--vk-font-body)',
                  color: 'var(--vk-text-muted)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  fontWeight: '500',
                  textTransform: 'capitalize',
                  transition: 'color 0.2s',
                  padding: '0.5rem 0',
                }}
                  onMouseEnter={e => { e.target.style.color = 'var(--vk-accent)'; }}
                  onMouseLeave={e => { e.target.style.color = 'var(--vk-text-muted)'; }}
                >
                  {s}
                </a>
              ))}
            </div>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(o => !o)}
              className="vk-nav-mobile"
              aria-label="Toggle menu"
              style={{
                background: 'none',
                border: '1px solid var(--vk-border)',
                borderRadius: 'var(--vk-radius)',
                padding: '0.5rem',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px',
                minWidth: '44px',
                minHeight: '44px',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {[0,1,2].map(i => (
                <span key={i} style={{
                  display: 'block',
                  width: '18px',
                  height: '2px',
                  background: 'var(--vk-text)',
                  borderRadius: '2px',
                  transition: 'opacity 0.2s',
                  opacity: mobileMenuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>

          {/* Mobile dropdown menu */}
          {mobileMenuOpen && (
            <div style={{
              borderTop: '1px solid var(--vk-border)',
              paddingBottom: '0.75rem',
            }} className="vk-nav-mobile">
              {navSections.map(s => (
                <a key={s} href={`#${s}`}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'block',
                    padding: '0.75rem 0',
                    fontFamily: 'var(--vk-font-body)',
                    color: 'var(--vk-text-muted)',
                    textDecoration: 'none',
                    fontSize: '1rem',
                    fontWeight: '500',
                    textTransform: 'capitalize',
                    borderBottom: '1px solid var(--vk-border)',
                  }}>
                  {s}
                </a>
              ))}
            </div>
          )}

          {/* Responsive styles injected inline */}
          <style>{`
            .vk-nav-desktop { display: flex !important; }
            .vk-nav-mobile  { display: none !important; }
            @media (max-width: 640px) {
              .vk-nav-desktop { display: none !important; }
              .vk-nav-mobile  { display: flex !important; }
            }
          `}</style>
        </nav>

        {/* ── Sections in order ─────────────────────────────────────────── */}
        {sectionOrder.map(key => {
          const el = sectionMap[key];
          if (!el) return null;
          return <div key={key}>{el}</div>;
        })}

        {/* ── Footer ────────────────────────────────────────────────────── */}
        <footer style={{
          padding: '2.5rem 1.5rem',
          borderTop: '1px solid var(--vk-border)',
          background: 'var(--vk-surface)',
          textAlign: 'center',
        }}>
          <p style={{
            fontFamily: 'var(--vk-font-body)',
            fontSize: '0.875rem',
            color: 'var(--vk-text-muted)',
          }}>
            Built with{' '}
            <a href="/" style={{ color: 'var(--vk-accent)', textDecoration: 'none', fontWeight: '600' }}>
              VibeKit Studio
            </a>
            {' · '}
            <span>{theme.emoji} {theme.name}</span>
          </p>
        </footer>
      </div>
    </>
  );
}