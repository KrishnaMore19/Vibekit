// src/pages/EditorPage.jsx
import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Monitor, Tablet, Smartphone, Globe, EyeOff,
  ChevronUp, ChevronDown, Save, Check, Loader2, ExternalLink,
  Zap, Settings, Palette, Plus, Trash2, Image, RefreshCw, Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { pages as pagesApi } from '../lib/api';
import { THEMES } from '../themes';
import ThemedPage from '../components/preview/ThemedPage';

// ─── Viewport presets ─────────────────────────────────────────────────────────
const VIEWPORTS = [
  { id: 'desktop', label: 'Desktop', icon: Monitor, width: '100%', maxWidth: '100%' },
  { id: 'tablet', label: 'Tablet', icon: Tablet, width: '768px', maxWidth: '768px' },
  { id: 'mobile', label: 'Mobile', icon: Smartphone, width: '375px', maxWidth: '375px' },
];

// ─── Auto-save hook ───────────────────────────────────────────────────────────
function useAutoSave(pageId, data, onSaved) {
  const timerRef = useRef(null);
  const lastSavedRef = useRef(null);
  const [saveStatus, setSaveStatus] = useState('saved');

  const save = useCallback(async (d) => {
    setSaveStatus('saving');
    try {
      await pagesApi.update(pageId, d);
      lastSavedRef.current = JSON.stringify(d);
      setSaveStatus('saved');
      onSaved?.();
    } catch {
      setSaveStatus('unsaved');
    }
  }, [pageId, onSaved]);

  useEffect(() => {
    const serialized = JSON.stringify(data);
    if (serialized === lastSavedRef.current) return;
    setSaveStatus('unsaved');
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => save(data), 1500);
    return () => clearTimeout(timerRef.current);
  }, [data, save]);

  const forceSave = useCallback(() => {
    clearTimeout(timerRef.current);
    return save(data);
  }, [data, save]);

  return { saveStatus, forceSave };
}

// ─── Field components ─────────────────────────────────────────────────────────
const Input = ({ label, value, onChange, placeholder, type = 'text', hint }) => (
  <div>
    <label className="block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">{label}</label>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all min-h-[44px]"
    />
    {hint && <p className="text-[11px] text-white/30 mt-1">{hint}</p>}
  </div>
);

const Textarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div>
    <label className="block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">{label}</label>
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 bg-white/[0.05] border border-white/10 rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-amber-500/50 transition-all resize-y"
    />
  </div>
);

// ─── Section editors ──────────────────────────────────────────────────────────
function HeroEditor({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="flex flex-col gap-4">
      <Textarea label="Subtitle" value={data.subtitle || ''} onChange={v => set('subtitle', v)} placeholder="A beautiful page..." rows={2} />
      <div className="grid grid-cols-2 gap-2">
        <Input label="Button Text" value={data.buttonText || ''} onChange={v => set('buttonText', v)} placeholder="Get Started" />
        <Input label="Button URL" value={data.buttonUrl || ''} onChange={v => set('buttonUrl', v)} placeholder="#contact" />
      </div>
    </div>
  );
}

function FeaturesEditor({ data, onChange }) {
  const features = data || [];
  const update = (idx, key, val) => onChange(features.map((f, i) => i === idx ? { ...f, [key]: val } : f));
  const add = () => {
    if (features.length >= 6) { toast.error('Max 6 features'); return; }
    onChange([...features, { id: crypto.randomUUID(), title: '', description: '' }]);
  };
  const remove = (idx) => {
    if (features.length <= 3) { toast.error('Min 3 features'); return; }
    onChange(features.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      {features.map((f, i) => (
        <div key={f.id || i} className="rounded-xl p-3 flex flex-col gap-3 border border-white/[0.08] bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-400/60">Feature {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400/50 hover:text-red-400 transition-colors p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input label="Title" value={f.title} onChange={v => update(i, 'title', v)} placeholder={`Feature ${i + 1}`} />
          <Textarea label="Description" value={f.description} onChange={v => update(i, 'description', v)} placeholder="Short description..." rows={2} />
        </div>
      ))}
      {features.length < 6 && (
        <button onClick={add} className="flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-white/15 rounded-xl text-sm text-white/40 hover:text-white/70 hover:border-amber-500/40/40 transition-all min-h-[44px]">
          <Plus className="w-4 h-4" /> Add Feature
        </button>
      )}
    </div>
  );
}

function GalleryEditor({ data, onChange }) {
  const images = data || [];
  const update = (idx, key, val) => onChange(images.map((img, i) => i === idx ? { ...img, [key]: val } : img));
  const add = () => {
    if (images.length >= 8) { toast.error('Max 8 images'); return; }
    onChange([...images, { id: crypto.randomUUID(), url: '', alt: '' }]);
  };
  const remove = (idx) => {
    if (images.length <= 3) { toast.error('Min 3 images'); return; }
    onChange(images.filter((_, i) => i !== idx));
  };

  return (
    <div className="flex flex-col gap-4">
      {images.map((img, i) => (
        <div key={img.id || i} className="rounded-xl p-3 flex flex-col gap-3 border border-white/[0.08] bg-white/[0.03]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono text-amber-400/60">Image {i + 1}</span>
            <button onClick={() => remove(i)} className="text-red-400/50 hover:text-red-400 transition-colors p-1">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <Input label="Image URL" value={img.url} onChange={v => update(i, 'url', v)} placeholder="https://..." />
          <Input label="Alt Text" value={img.alt} onChange={v => update(i, 'alt', v)} placeholder="Describe this image" />
          {img.url && (
            <img src={img.url} alt={img.alt} className="w-full h-20 object-cover rounded-lg border border-white/10"
              onError={e => { e.target.style.display = 'none'; }} />
          )}
        </div>
      ))}
      {images.length < 8 && (
        <button onClick={add} className="flex items-center justify-center gap-1.5 py-2.5 border border-dashed border-white/15 rounded-xl text-sm text-white/40 hover:text-white/70 hover:border-amber-500/40/40 transition-all min-h-[44px]">
          <Image className="w-4 h-4" /> Add Image
        </button>
      )}
    </div>
  );
}

function ContactEditor({ data, onChange }) {
  const set = (key, val) => onChange({ ...data, [key]: val });
  return (
    <div className="flex flex-col gap-3">
      <Input label="Section Title" value={data.title || ''} onChange={v => set('title', v)} placeholder="Get In Touch" />
      <Textarea label="Subtitle" value={data.subtitle || ''} onChange={v => set('subtitle', v)} placeholder="We'd love to hear from you." rows={2} />
    </div>
  );
}

// ─── Section panel ────────────────────────────────────────────────────────────
function SectionPanel({ sectionKey, index, total, content, onChange, onMoveUp, onMoveDown }) {
  const [open, setOpen] = useState(index === 0);

  const LABELS = {
    hero: { label: 'Hero', icon: '🌟', desc: 'Title, subtitle & CTA button' },
    features: { label: 'Features', icon: '⚡', desc: '3–6 feature cards' },
    gallery: { label: 'Gallery', icon: '🖼️', desc: '3–8 images with lightbox' },
    contact: { label: 'Contact', icon: '✉️', desc: 'Contact form & message' },
  };

  const info = LABELS[sectionKey] || { label: sectionKey, icon: '📦', desc: '' };

  const renderEditor = () => {
    switch (sectionKey) {
      case 'hero': return <HeroEditor data={content.hero || {}} onChange={v => onChange('hero', v)} />;
      case 'features': return <FeaturesEditor data={content.features || []} onChange={v => onChange('features', v)} />;
      case 'gallery': return <GalleryEditor data={content.gallery || []} onChange={v => onChange('gallery', v)} />;
      case 'contact': return <ContactEditor data={content.contact || {}} onChange={v => onChange('contact', v)} />;
      default: return null;
    }
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] hover:border-white/[0.14] transition-colors">
      {/* Header row — always visible */}
      <div className="flex items-center px-3 py-3 gap-2">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-3 flex-1 text-left min-h-[44px]"
        >
          <span className="text-xl flex-shrink-0 leading-none">{info.icon}</span>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm text-white">{info.label}</p>
            {!open && <p className="text-[11px] text-white/35 truncate mt-0.5">{info.desc}</p>}
          </div>
          <ChevronDown
            className={`w-4 h-4 text-white/30 transition-transform duration-200 flex-shrink-0 ${open ? 'rotate-180' : ''}`}
          />
        </button>
        <div className="flex gap-0.5 flex-shrink-0">
          <button
            onClick={onMoveUp}
            disabled={index === 0}
            className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-h-[44px] flex items-center"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={index === total - 1}
            className="p-1.5 hover:bg-white/10 rounded-lg disabled:opacity-20 disabled:cursor-not-allowed transition-colors min-h-[44px] flex items-center"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Expandable editor body — no overflow clipping so inputs/textareas are fully usable */}
      {open && (
        <div className="border-t border-white/[0.06] p-4 bg-white/[0.01] flex flex-col gap-4">
          {renderEditor()}
        </div>
      )}
    </div>
  );
}

// ─── Theme picker panel — beautiful redesign ──────────────────────────────────
function ThemePickerPanel({ currentTheme, onChange }) {
  const themes = Object.values(THEMES);

  return (
    <div className="flex flex-col gap-2">
      {themes.map(t => {
        const isActive = currentTheme === t.id;
        // Extract accent and bg colors from theme vars for the swatch preview
        const accent = t.vars?.['--vk-accent'] || '#8b5cf6';
        const bg = t.vars?.['--vk-bg'] || '#ffffff';
        const surface = t.vars?.['--vk-surface'] || '#f8f8f8';
        const text = t.vars?.['--vk-text'] || '#111111';

        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`group flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200 min-h-[56px] ${
              isActive
                ? 'border-amber-500/40 bg-amber-500/8 shadow-lg shadow-violet-500/10'
                : 'border-white/[0.08] hover:border-white/20 bg-white/[0.02] hover:bg-white/[0.05]'
            }`}
          >
            {/* Mini theme preview swatch */}
            <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden border border-white/10 shadow-md relative">
              <div style={{ background: bg, width: '100%', height: '100%', position: 'relative' }}>
                {/* Simulated nav bar */}
                <div style={{ background: surface, height: '35%', borderBottom: `1px solid ${accent}22` }} />
                {/* Simulated accent button */}
                <div style={{
                  position: 'absolute', bottom: '6px', left: '50%', transform: 'translateX(-50%)',
                  width: '60%', height: '6px', borderRadius: '3px', background: accent,
                }} />
              </div>
            </div>

            {/* Theme info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-base leading-none">{t.emoji}</span>
                <p className="text-sm font-semibold text-white leading-tight truncate">{t.name}</p>
                {isActive && (
                  <span className="ml-auto flex-shrink-0 text-[10px] font-bold text-amber-400 bg-amber-500/12 px-1.5 py-0.5 rounded-full">
                    Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-white/40 mt-0.5 truncate">{t.description || ''}</p>
              {/* Color dots */}
              <div className="flex gap-1 mt-1.5">
                {[bg, surface, accent].map((color, ci) => (
                  <div key={ci} className="w-3 h-3 rounded-full border border-white/20 flex-shrink-0"
                    style={{ background: color }} />
                ))}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

// ─── Slug editor ──────────────────────────────────────────────────────────────
function SlugEditor({ pageId, currentSlug, onUpdate }) {
  const [slug, setSlug] = useState(currentSlug);
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);
  const timerRef = useRef(null);

  useEffect(() => { setSlug(currentSlug); }, [currentSlug]);

  const checkSlug = useCallback((val) => {
    if (!val || val === currentSlug) { setAvailable(null); return; }
    clearTimeout(timerRef.current);
    setChecking(true);
    timerRef.current = setTimeout(async () => {
      try {
        const { available: avail } = await pagesApi.checkSlug(pageId, val);
        setAvailable(avail);
      } catch {}
      setChecking(false);
    }, 600);
  }, [pageId, currentSlug]);

  const handleChange = (val) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 60);
    setSlug(clean);
    checkSlug(clean);
  };

  const handleSave = async () => {
    if (!slug || slug === currentSlug) return;
    if (available === false) { toast.error('Slug already taken'); return; }
    try {
      await pagesApi.update(pageId, { slug });
      onUpdate(slug);
      setAvailable(null);
      toast.success('URL updated!');
    } catch (err) {
      toast.error(err.message || 'Failed to update slug');
    }
  };

  return (
    <div>
      <label className="block text-[11px] font-semibold text-white/50 mb-1.5 uppercase tracking-wide">Page URL</label>
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-white/30 text-xs pointer-events-none">/p/</span>
          <input
            value={slug}
            onChange={e => handleChange(e.target.value)}
            className={`w-full pl-7 pr-7 py-2 bg-white/[0.05] border rounded-lg text-sm text-white focus:outline-none transition-all min-h-[44px] ${
              available === true ? 'border-green-500/60'
              : available === false ? 'border-red-500/60'
              : 'border-white/10 focus:border-amber-500/50'
            }`}
          />
          {checking && <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-white/40 animate-spin" />}
        </div>
        <button
          onClick={handleSave}
          disabled={!slug || slug === currentSlug || available === false}
          className="px-3 py-2 bg-white/10 hover:bg-white/20 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg text-xs font-medium transition-all min-h-[44px]"
        >
          Save
        </button>
      </div>
      {available === false && <p className="text-[11px] text-red-400 mt-1">This slug is already taken</p>}
      {available === true && <p className="text-[11px] text-green-400 mt-1">✓ Available</p>}
    </div>
  );
}

// ─── Save status badge ────────────────────────────────────────────────────────
function SaveBadge({ status }) {
  return (
    <div className="flex items-center gap-1.5">
      {status === 'saving' && <Loader2 className="w-3.5 h-3.5 animate-spin text-white/40" />}
      {status === 'saved' && <Check className="w-3.5 h-3.5 text-green-400" />}
      {status === 'unsaved' && <RefreshCw className="w-3.5 h-3.5 text-yellow-400" />}
      <span className={`text-xs ${
        status === 'saved' ? 'text-green-400'
        : status === 'unsaved' ? 'text-yellow-400'
        : 'text-white/40'
      }`}>
        {status === 'saving' ? 'Saving...' : status === 'saved' ? 'Saved' : 'Unsaved'}
      </span>
    </div>
  );
}

// ─── Main Editor ──────────────────────────────────────────────────────────────
export default function EditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewport, setViewport] = useState('desktop');
  const [activePanel, setActivePanel] = useState('sections');
  const [publishing, setPublishing] = useState(false);
  const [title, setTitle] = useState('');

  const [theme, setTheme] = useState('minimal');
  const [content, setContent] = useState({});
  const [slug, setSlug] = useState('');

  const draft = { title, theme, content };
  const { saveStatus, forceSave } = useAutoSave(id, draft, null);

  useEffect(() => {
    pagesApi.get(id)
      .then(({ page }) => {
        setPage(page);
        setTitle(page.title);
        setTheme(page.theme);
        setContent(page.content || {});
        setSlug(page.slug);
      })
      .catch(() => { toast.error('Failed to load page'); navigate('/app'); })
      .finally(() => setLoading(false));
  }, [id]);

  const updateSection = useCallback((key, val) => {
    setContent(prev => ({ ...prev, [key]: val }));
  }, []);

  const moveSection = useCallback((index, dir) => {
    setContent(prev => {
      const order = [...(prev.sectionOrder || ['hero', 'features', 'gallery', 'contact'])];
      const newIdx = index + dir;
      if (newIdx < 0 || newIdx >= order.length) return prev;
      [order[index], order[newIdx]] = [order[newIdx], order[index]];
      return { ...prev, sectionOrder: order };
    });
  }, []);

  // ✅ FIX: DB stores status as 'PUBLISHED' (uppercase), not 'published'
  const isPublished = page?.status === 'PUBLISHED';

  const handlePublishToggle = async () => {
    if (!page) return;
    setPublishing(true);
    try {
      // Always save latest content first
      await forceSave();

      const { page: updated } = isPublished
        ? await pagesApi.unpublish(id)
        : await pagesApi.publish(id);

      // ✅ FIX: update page state with full server response so status syncs
      setPage(updated);

      toast.success(
        isPublished ? 'Page unpublished' : '🚀 Page is live!',
        { duration: isPublished ? 3000 : 5000 }
      );

      // Open the live page in new tab after publishing
      if (!isPublished) {
        setTimeout(() => window.open(`/p/${updated.slug}`, '_blank'), 500);
      }
    } catch (err) {
      toast.error(err.message || 'Failed to update publish status');
    } finally {
      setPublishing(false);
    }
  };

  const sectionOrder = content.sectionOrder || ['hero', 'features', 'gallery', 'contact'];
  const previewPage = { ...page, title, theme, content, slug };
  const vp = VIEWPORTS.find(v => v.id === viewport) || VIEWPORTS[0];

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#050510]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-amber-500/40 border-t-transparent rounded-full animate-spin" />
          <p className="text-white/40 text-sm">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#050510]">

      {/* ── Top toolbar ────────────────────────────────────────────────────── */}
      <header className="flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 bg-[#0a0a1a]/90 backdrop-blur border-b border-white/[0.06] flex-shrink-0 z-30">

        {/* Back */}
        <Link to="/app" className="p-2 hover:bg-white/10 rounded-lg transition-colors min-h-[44px] flex items-center flex-shrink-0" title="Back to dashboard">
          <ArrowLeft className="w-4 h-4 text-white/70" />
        </Link>

        {/* Title input */}
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="flex-1 min-w-0 bg-transparent border-none outline-none font-bold text-base text-white truncate placeholder-white/30"
          placeholder="Page title..."
        />

        {/* Save badge */}
        <div className="hidden sm:flex flex-shrink-0">
          <SaveBadge status={saveStatus} />
        </div>

        {/* Viewport toggle (desktop only) */}
        <div className="hidden sm:flex items-center bg-white/[0.05] border border-white/[0.08] rounded-xl p-1 gap-0.5 flex-shrink-0">
          {VIEWPORTS.map(v => {
            const Icon = v.icon;
            return (
              <button key={v.id} onClick={() => setViewport(v.id)} title={v.label}
                className={`p-2 rounded-lg transition-all min-h-[36px] flex items-center justify-center ${
                  viewport === v.id ? 'bg-amber-500 text-white shadow-sm' : 'text-white/40 hover:text-white/70'
                }`}>
                <Icon className="w-4 h-4" />
              </button>
            );
          })}
        </div>

        {/* Publish + live link */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Live link button — only shown when published */}
          {isPublished && (
            <a
              href={`/p/${slug}`}
              target="_blank"
              rel="noopener noreferrer"
              title="Open live page"
              className="p-2 bg-green-500/10 hover:bg-green-500/20 border border-green-500/30 rounded-lg text-green-400 transition-colors min-h-[44px] flex items-center"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}

          {/* Publish / Unpublish button */}
          <button
            onClick={handlePublishToggle}
            disabled={publishing}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all min-h-[44px] ${
              isPublished
                ? 'bg-green-500/15 border border-green-500/30 text-green-400 hover:bg-red-500/15 hover:border-red-500/30 hover:text-red-400'
                : 'bg-amber-500 hover:bg-amber-400 text-white shadow-lg shadow-amber-500/20'
            }`}
          >
            {publishing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isPublished ? (
              <><EyeOff className="w-4 h-4" /><span className="hidden sm:block">Unpublish</span></>
            ) : (
              <><Globe className="w-4 h-4" /><span className="hidden sm:block">Publish</span></>
            )}
          </button>
        </div>
      </header>

      {/* ── Body ─────────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── Left panel ───────────────────────────────────────────────────── */}
        <aside className="w-72 lg:w-80 flex-shrink-0 flex flex-col bg-[#0a0a1a]/80 border-r border-white/[0.06] min-h-0">

          {/* Panel tabs */}
          <div className="flex border-b border-white/[0.06] flex-shrink-0 bg-[#060612]">
            {[
              { id: 'sections', label: 'Sections', icon: Zap },
              { id: 'theme', label: 'Vibe', icon: Sparkles },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActivePanel(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-xs font-semibold transition-all min-h-[44px] ${
                    activePanel === tab.id
                      ? 'text-white border-b-2 border-amber-500/40 bg-amber-500/5'
                      : 'text-white/40 hover:text-white/70'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Panel content */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 flex flex-col gap-3 scroll-smooth">

            {/* ── Sections panel ─────────────────────────────────────────── */}
            {activePanel === 'sections' && (
              <>
                <p className="text-[11px] text-white/30 px-1 pt-1">Click to expand and edit each section</p>
                {sectionOrder.map((key, i) => (
                  <SectionPanel
                    key={key}
                    sectionKey={key}
                    index={i}
                    total={sectionOrder.length}
                    content={content}
                    onChange={updateSection}
                    onMoveUp={() => moveSection(i, -1)}
                    onMoveDown={() => moveSection(i, 1)}
                  />
                ))}
                <div className="h-4 flex-shrink-0" />
              </>
            )}

            {/* ── Theme / Vibe panel ─────────────────────────────────────── */}
            {activePanel === 'theme' && (
              <>
                <div className="px-1 pt-1 flex items-center justify-between">
                  <p className="text-[11px] text-white/30">Choose a visual vibe for your page</p>
                  {THEMES[theme] && (
                    <span className="text-[11px] text-amber-400 font-medium">{THEMES[theme].emoji} {THEMES[theme].name.split(' / ')[0]}</span>
                  )}
                </div>
                <ThemePickerPanel currentTheme={theme} onChange={setTheme} />
              </>
            )}

            {/* ── Settings panel ─────────────────────────────────────────── */}
            {activePanel === 'settings' && page && (
              <>
                <p className="text-[11px] text-white/30 px-1 pt-1">Page settings and metadata</p>

                {/* Status card */}
                <div className={`rounded-xl p-3 border flex items-start gap-3 ${
                  isPublished
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-white/[0.03] border-white/[0.08]'
                }`}>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    isPublished ? 'bg-green-500/20' : 'bg-white/10'
                  }`}>
                    {isPublished ? <Globe className="w-4 h-4 text-green-400" /> : <EyeOff className="w-4 h-4 text-white/40" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isPublished ? 'text-green-400' : 'text-white/60'}`}>
                      {isPublished ? 'Published' : 'Draft'}
                    </p>
                    {isPublished ? (
                      <a href={`/p/${slug}`} target="_blank" rel="noopener noreferrer"
                        className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 mt-0.5 truncate">
                        /p/{slug} <ExternalLink className="w-2.5 h-2.5 flex-shrink-0" />
                      </a>
                    ) : (
                      <p className="text-[11px] text-white/30 mt-0.5">Not visible to the public yet</p>
                    )}
                  </div>
                </div>

                {/* Slug editor */}
                <div className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-3">
                  <SlugEditor pageId={id} currentSlug={slug} onUpdate={setSlug} />
                </div>

                {/* Viewport toggle (for mobile sidebar) */}
                <div>
                  <label className="block text-[11px] font-semibold text-white/50 mb-2 uppercase tracking-wide">Preview Width</label>
                  <div className="flex gap-1 bg-white/[0.03] border border-white/[0.08] rounded-xl p-1">
                    {VIEWPORTS.map(v => {
                      const Icon = v.icon;
                      return (
                        <button key={v.id} onClick={() => setViewport(v.id)}
                          className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-xs transition-all min-h-[44px] ${
                            viewport === v.id ? 'bg-amber-500 text-white' : 'text-white/40 hover:text-white/60'
                          }`}>
                          <Icon className="w-3.5 h-3.5" /><span className="hidden sm:block ml-1">{v.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Force save */}
                <button onClick={forceSave}
                  className="flex items-center justify-center gap-2 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-sm font-medium hover:bg-white/[0.07] transition-all min-h-[44px] text-white/70">
                  <Save className="w-4 h-4" /> Force Save
                </button>
              </>
            )}
          </div>
        </aside>

        {/* ── Preview pane ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-hidden flex flex-col bg-[#030308]">

          {/* Preview label bar */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/[0.04] flex-shrink-0 bg-[#040410]">
            <div className="flex items-center gap-2 text-xs text-white/30">
              <span className="font-medium">Preview</span>
              <span>·</span>
              <span className="font-mono text-white/50">{vp.label}</span>
              {viewport !== 'desktop' && <span className="font-mono text-amber-400/60">({vp.maxWidth})</span>}
            </div>
            <div className="flex items-center gap-3">
              {isPublished && (
                <span className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse inline-block" />
                  Live
                </span>
              )}
              {/* Mobile viewport toggle in preview bar */}
              <div className="flex sm:hidden items-center gap-0.5">
                {VIEWPORTS.map(v => {
                  const Icon = v.icon;
                  return (
                    <button key={v.id} onClick={() => setViewport(v.id)} title={v.label}
                      className={`p-1.5 rounded-md transition-all ${viewport === v.id ? 'text-amber-400' : 'text-white/30 hover:text-white/60'}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Preview frame */}
          <div className="flex-1 overflow-auto flex justify-center p-4 bg-[#030308]">
            <motion.div
              animate={{ width: vp.width, maxWidth: vp.maxWidth === '100%' ? '100%' : vp.maxWidth }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden rounded-xl shadow-2xl border border-white/[0.08]"
              style={{
                width: vp.width,
                maxWidth: vp.maxWidth === '100%' ? '100%' : vp.maxWidth,
                minWidth: viewport === 'mobile' ? '320px' : undefined,
                height: '100%',
                overflowY: 'auto',
                background: '#fff',
              }}
            >
              <ThemedPage page={previewPage} isPreview={true} />
            </motion.div>
          </div>
        </main>
      </div>
    </div>
  );
}