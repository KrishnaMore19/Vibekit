// src/pages/Dashboard.jsx
import { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, LogOut, Zap, Globe, FileText, Copy, Trash2,
  Eye, Edit3, ExternalLink, Search, LayoutGrid, List,
  Clock, TrendingUp, MoreVertical, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../lib/auth';
import { pages as pagesApi } from '../lib/api';
import { THEMES } from '../themes';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

const isPublished = (p) => p.status === 'PUBLISHED' || p.status === 'published';

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 flex flex-col gap-3"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      <div className="skeleton h-28 rounded-xl mb-1" />
      <div className="skeleton h-4 w-36 rounded-full" />
      <div className="skeleton h-3 w-24 rounded-full" />
      <div className="flex gap-2 mt-1">
        <div className="skeleton h-9 flex-1 rounded-xl" />
        <div className="skeleton h-9 w-16 rounded-xl" />
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({ open, title, desc, onConfirm, onCancel, danger = true }) {
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onCancel]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.7)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            className="rounded-2xl p-6 max-w-sm w-full shadow-2xl"
            style={{ background: 'var(--surface-2, #1a1a24)', border: '1px solid var(--border-hi)' }}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <button onClick={onCancel} className="p-1 transition-colors" style={{ color: 'var(--text-3)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--text-2)' }}>{desc}</p>
            <div className="flex gap-3">
              <button onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                Cancel
              </button>
              <button onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] ${
                  danger ? 'bg-red-500/80 hover:bg-red-500 text-white' : 'text-black'
                }`}
                style={!danger ? { background: 'var(--amber)' } : {}}>
                {danger ? 'Delete' : 'Confirm'}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Create Page Modal ────────────────────────────────────────────────────────
function CreatePageModal({ open, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [theme, setTheme] = useState('minimal');
  const [loading, setLoading] = useState(false);

  useEffect(() => { if (!open) { setTitle(''); setTheme('minimal'); } }, [open]);
  useEffect(() => {
    if (!open) return;
    const h = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', h);
    return () => document.removeEventListener('keydown', h);
  }, [open, onClose]);

  const handleCreate = async () => {
    if (!title.trim()) { toast.error('Please enter a page title'); return; }
    setLoading(true);
    try {
      const { page } = await pagesApi.create({ title: title.trim(), theme });
      toast.success('Page created!');
      onCreate(page);
      onClose();
    } catch (err) {
      toast.error(err.message || 'Failed to create page');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          style={{ background: 'rgba(0,0,0,0.72)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            className="rounded-2xl p-6 max-w-md w-full shadow-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">New Page</h2>
              <button onClick={onClose} className="p-1 transition-colors" style={{ color: 'var(--text-3)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>
                  Page Title
                </label>
                <input
                  autoFocus type="text" value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                  placeholder="My Awesome Page"
                  className="w-full px-4 py-3 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none transition-all min-h-[48px]"
                  style={{ background: 'var(--surface-2, #1a1a24)', border: '1px solid var(--border)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.5)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label className="block text-xs font-semibold mb-2 uppercase tracking-wide" style={{ color: 'var(--text-3)' }}>
                  Choose Vibe
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(THEMES).map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-center min-h-[64px]"
                      style={{
                        border: theme === t.id ? '1px solid rgba(245,166,35,0.5)' : '1px solid var(--border)',
                        background: theme === t.id ? 'rgba(245,166,35,0.08)' : 'var(--surface-2, #1a1a24)',
                      }}>
                      <span className="text-xl">{t.emoji}</span>
                      <span className="text-[10px] font-medium" style={{ color: 'var(--text-2)' }}>
                        {t.name.split(' / ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={onClose}
                className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors min-h-[44px]"
                style={{ background: 'var(--surface-2, #1a1a24)', border: '1px solid var(--border)' }}>
                Cancel
              </button>
              <button onClick={handleCreate} disabled={loading || !title.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold text-black transition-all min-h-[44px] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--amber)' }}>
                {loading
                  ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <><Plus className="w-4 h-4" /> Create Page</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Page Card ────────────────────────────────────────────────────────────────
function PageCard({ page, onDuplicate, onDelete, view = 'grid' }) {
  const navigate = useNavigate();
  const theme = THEMES[page.theme] || THEMES.minimal;
  const [menuOpen, setMenuOpen] = useState(false);
  const [duplicating, setDuplicating] = useState(false);
  const published = isPublished(page);

  const handleDuplicate = async (e) => {
    e?.stopPropagation();
    setMenuOpen(false);
    setDuplicating(true);
    try { await onDuplicate(page.id); }
    finally { setDuplicating(false); }
  };

  const handleDelete = () => { setMenuOpen(false); onDelete(page.id); };

  if (view === 'list') {
    return (
      <motion.div layout
        className="rounded-xl px-4 py-3 flex items-center gap-4 transition-all group card-lift"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xl flex-shrink-0"
          style={{ background: theme.preview.bg }}>
          {theme.emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm truncate">{page.title}</p>
          <p className="text-xs truncate" style={{ color: 'var(--text-3)' }}>/{page.slug}</p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
            style={published
              ? { background: 'rgba(34,197,94,0.12)', color: '#4ade80' }
              : { background: 'rgba(255,255,255,0.07)', color: 'var(--text-3)' }}>
            {published ? 'Live' : 'Draft'}
          </span>
          <span className="text-xs hidden sm:block" style={{ color: 'var(--text-3)' }}>{timeAgo(page.updated_at)}</span>
          {published && (
            <span className="text-xs hidden md:flex items-center gap-1" style={{ color: 'var(--text-3)' }}>
              <Eye className="w-3 h-3" />{page.view_count}
            </span>
          )}
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => navigate(`/app/edit/${page.id}`)}
              className="p-1.5 rounded-lg transition-colors min-h-[44px] flex items-center"
              style={{ color: 'var(--text-2)' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,166,35,0.1)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <Edit3 className="w-4 h-4" />
            </button>
            {published && (
              <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer"
                className="p-1.5 rounded-lg transition-colors min-h-[44px] flex items-center"
                style={{ color: '#4ade80' }}>
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button onClick={handleDuplicate} disabled={duplicating}
              className="p-1.5 rounded-lg transition-colors min-h-[44px] flex items-center"
              style={{ color: 'var(--text-2)' }}>
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={handleDelete}
              className="p-1.5 rounded-lg transition-colors min-h-[44px] flex items-center text-red-400/70 hover:text-red-400">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl overflow-hidden flex flex-col card-lift"
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
      {/* Preview strip */}
      <div className="h-32 relative flex items-center justify-center overflow-hidden cursor-pointer group/strip"
        onClick={() => navigate(`/app/edit/${page.id}`)}
        style={{ background: theme.preview.bg }}>
        <div className="absolute inset-0 flex flex-col gap-2.5 p-4 opacity-75">
          <div className="h-3.5 rounded-sm w-3/4" style={{ background: theme.preview.text, opacity: 0.8 }} />
          <div className="h-2 rounded-sm w-1/2" style={{ background: theme.preview.text, opacity: 0.4 }} />
          <div className="h-7 rounded-sm w-1/3 mt-1"
            style={{ background: theme.preview.accent, borderRadius: theme.vars['--vk-radius'] || '4px' }} />
        </div>
        <div className="absolute top-2 right-2 text-xl">{theme.emoji}</div>
        <div className="absolute inset-0 opacity-0 group-hover/strip:opacity-100 transition-opacity flex items-center justify-center"
          style={{ background: 'rgba(6,6,8,0.5)' }}>
          <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
            <Edit3 className="w-4 h-4" /> Edit
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 flex-1 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{page.title}</h3>
            <p className="text-xs truncate mt-0.5" style={{ color: 'var(--text-3)' }}>/{page.slug}</p>
          </div>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold flex-shrink-0"
            style={published
              ? { background: 'rgba(34,197,94,0.12)', color: '#4ade80' }
              : { background: 'rgba(255,255,255,0.06)', color: 'var(--text-3)' }}>
            {published ? 'Live' : 'Draft'}
          </span>
        </div>
        <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-3)' }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(page.updated_at)}</span>
          {published && (
            <span className="flex items-center gap-1"><TrendingUp className="w-3 h-3" />{page.view_count} views</span>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="px-4 pb-4 flex items-center gap-2">
        <button onClick={() => navigate(`/app/edit/${page.id}`)}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px]"
          style={{ background: 'rgba(245,166,35,0.09)', border: '1px solid rgba(245,166,35,0.18)', color: 'var(--amber)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(245,166,35,0.16)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(245,166,35,0.09)'}>
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </button>

        {published && (
          <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-semibold transition-colors min-h-[44px]"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: '#4ade80' }}>
            <Globe className="w-3.5 h-3.5" /> Live
          </a>
        )}

        {/* More menu */}
        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="p-2 rounded-xl transition-colors min-h-[44px] flex items-center justify-center"
            style={{ border: '1px solid var(--border)', color: 'var(--text-3)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
            <MoreVertical className="w-4 h-4" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div initial={{ opacity: 0, scale: 0.92, y: -4 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.92, y: -4 }}
                  className="absolute bottom-full right-0 mb-1 w-38 rounded-xl overflow-hidden shadow-2xl z-20"
                  style={{ background: 'var(--surface-2, #1a1a24)', border: '1px solid var(--border-hi)' }}>
                  <button onClick={handleDuplicate} disabled={duplicating}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs transition-colors text-left min-h-[44px]"
                    style={{ color: 'var(--text-2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button onClick={handleDelete}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-400 transition-colors text-left min-h-[44px]"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onNew }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-28 text-center px-4">
      <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'var(--surface)', border: '1px solid rgba(245,166,35,0.2)', boxShadow: '0 0 40px rgba(245,166,35,0.08)' }}>
        <FileText className="w-9 h-9" style={{ color: 'var(--amber)' }} />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">No pages yet</h3>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--text-2)' }}>
        Create your first page and start building something beautiful with a vibe that's uniquely yours.
      </p>
      <button onClick={onNew}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black glow-amber transition-all min-h-[44px]"
        style={{ background: 'var(--amber)' }}>
        <Plus className="w-5 h-5" /> Create your first page
      </button>
    </motion.div>
  );
}

// ─── Dashboard Main ───────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pagesList, setPagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');

  useEffect(() => {
    pagesApi.list()
      .then(({ pages }) => setPagesList(pages))
      .catch(() => toast.error('Failed to load pages'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = useCallback((page) => {
    setPagesList(prev => [page, ...prev]);
    navigate(`/app/edit/${page.id}`);
  }, [navigate]);

  const handleDuplicate = useCallback(async (id) => {
    try {
      const { page } = await pagesApi.duplicate(id);
      setPagesList(prev => [page, ...prev]);
      toast.success('Page duplicated!');
    } catch { toast.error('Failed to duplicate page'); }
  }, []);

  const handleDelete = useCallback(async (id) => {
    try {
      await pagesApi.delete(id);
      setPagesList(prev => prev.filter(p => p.id !== id));
      toast.success('Page deleted');
    } catch { toast.error('Failed to delete page'); }
    setDeleteTarget(null);
  }, []);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const published = pagesList.filter(p => isPublished(p)).length;
  const totalViews = pagesList.reduce((sum, p) => sum + (p.view_count || 0), 0);
  const filtered = pagesList.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const statCards = [
    { label: 'Total Pages', value: pagesList.length, icon: FileText },
    { label: 'Published', value: published, icon: Globe },
    { label: 'Drafts', value: pagesList.length - published, icon: Edit3 },
    { label: 'Total Views', value: totalViews.toLocaleString(), icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* BG grid */}
      <div className="fixed inset-0 bg-grid pointer-events-none" style={{ opacity: 1 }} />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #f5a623, #c47d0e)' }}>
                <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-base hidden sm:block">VibeKit</span>
            </Link>
            <span className="hidden sm:block" style={{ color: 'var(--border-hi)' }}>/</span>
            <span className="text-sm hidden sm:block" style={{ color: 'var(--text-2)' }}>Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block" style={{ color: 'var(--text-3)' }}>
              {user?.name || user?.email?.split('@')[0]}
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px]"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--border-hi)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:block">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-5 sm:px-8 py-10">
        {/* Page header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl sm:text-4xl font-bold">My Pages</h1>
            <p className="text-sm mt-1.5" style={{ color: 'var(--text-3)' }}>
              {pagesList.length} page{pagesList.length !== 1 ? 's' : ''} · {published} live · {totalViews.toLocaleString()} views
            </p>
          </div>
          <button onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-black glow-amber transition-all min-h-[48px] self-start sm:self-auto"
            style={{ background: 'var(--amber)' }}>
            <Plus className="w-5 h-5" /> New Page
          </button>
        </div>

        {/* Stats */}
        {!loading && pagesList.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {statCards.map(({ label, value, icon: Icon }) => (
              <div key={label} className="rounded-xl p-4 card-lift"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--amber)' }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--text-3)' }}>{label}</span>
                </div>
                <p className="font-display text-2xl font-bold">{value}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search + view toggle */}
        {!loading && pagesList.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-7">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-3)' }} />
              <input
                type="text" value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Search pages..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white placeholder-white/25 focus:outline-none transition-all min-h-[44px]"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(245,166,35,0.4)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {[{ id: 'grid', Icon: LayoutGrid }, { id: 'list', Icon: List }].map(({ id, Icon }) => (
                <button key={id} onClick={() => setView(id)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-sm transition-all min-h-[44px]"
                  style={view === id
                    ? { background: 'rgba(245,166,35,0.12)', color: 'var(--amber)' }
                    : { color: 'var(--text-3)' }}>
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className={view === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' : 'flex flex-col gap-3'}>
            {[1,2,3,4,5,6].map(i => <SkeletonCard key={i} />)}
          </div>
        ) : pagesList.length === 0 ? (
          <EmptyState onNew={() => setCreateOpen(true)} />
        ) : filtered.length === 0 ? (
          <div className="text-center py-20" style={{ color: 'var(--text-3)' }}>
            No pages match "{search}"
          </div>
        ) : (
          <motion.div layout
            className={view === 'grid'
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'flex flex-col gap-2'}>
            <AnimatePresence mode="popLayout">
              {filtered.map(page => (
                <PageCard key={page.id} page={page} view={view}
                  onDuplicate={handleDuplicate}
                  onDelete={(id) => setDeleteTarget(id)} />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      <CreatePageModal open={createOpen} onClose={() => setCreateOpen(false)} onCreate={handleCreate} />
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this page?"
        desc="This action cannot be undone. The page and all its data will be permanently removed."
        onConfirm={() => handleDelete(deleteTarget)}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}