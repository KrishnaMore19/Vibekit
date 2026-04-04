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
          style={{ background: 'rgba(16,14,9,0.45)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
          <motion.div initial={{ scale: 0.92, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.92, opacity: 0 }}
            className="rounded-2xl p-6 max-w-sm w-full"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', boxShadow: '0 24px 80px rgba(16,14,9,0.18)' }}>
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-display text-lg font-bold">{title}</h3>
              <button onClick={onCancel} className="p-1 transition-colors" style={{ color: 'var(--text-3)' }}>
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-sm mb-6 font-body" style={{ color: 'var(--text-2)' }}>{desc}</p>
            <div className="flex gap-3">
              <button onClick={onCancel}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium transition-colors min-h-[44px] font-body"
                style={{ background: 'var(--bg)', border: '1px solid var(--border)' }}>
                Cancel
              </button>
              <button onClick={onConfirm}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors min-h-[44px] font-body ${
                  danger ? 'bg-red-600 hover:bg-red-700 text-white' : ''
                }`}
                style={!danger ? { background: 'var(--text)', color: 'var(--bg)' } : {}}>
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
          style={{ background: 'rgba(16,14,9,0.45)' }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
          <motion.div initial={{ scale: 0.92, opacity: 0, y: 16 }} animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 16 }}
            className="rounded-2xl p-6 max-w-md w-full"
            style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', boxShadow: '0 24px 80px rgba(16,14,9,0.18)' }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-bold">New Page</h2>
              <button onClick={onClose} className="p-1 transition-colors" style={{ color: 'var(--text-3)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-[11px] font-semibold mb-1.5 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>
                  Page Title
                </label>
                <input
                  autoFocus type="text" value={title}
                  onChange={e => setTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate(); }}
                  placeholder="My Awesome Page"
                  className="w-full px-4 py-3 rounded-xl text-sm placeholder-black/25 focus:outline-none transition-all min-h-[48px] font-body"
                  style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
                  onFocus={e => e.target.style.borderColor = 'rgba(16,14,9,0.45)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border)'}
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold mb-2 uppercase tracking-widest font-body" style={{ color: 'var(--text-3)' }}>
                  Choose Vibe
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {Object.values(THEMES).map(t => (
                    <button key={t.id} onClick={() => setTheme(t.id)}
                      className="flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all text-center min-h-[64px]"
                      style={{
                        border: theme === t.id ? '1.5px solid rgba(16,14,9,0.55)' : '1px solid var(--border)',
                        background: theme === t.id ? 'rgba(16,14,9,0.06)' : 'var(--bg)',
                      }}>
                      <span className="text-xl">{t.emoji}</span>
                      <span className="text-[10px] font-semibold font-body" style={{ color: 'var(--text-2)' }}>
                        {t.name.split(' / ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={handleCreate} disabled={loading}
                className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-semibold text-sm transition-all min-h-[48px] disabled:opacity-50 disabled:cursor-not-allowed font-body glow-amber"
                style={{ background: 'var(--text)', color: 'var(--bg)' }}>
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <><Plus className="w-4 h-4" /> Create Page</>
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ onNew }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center text-center py-24 px-4">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
        <FileText className="w-7 h-7" style={{ color: 'var(--text-3)' }} />
      </div>
      <h3 className="font-display text-2xl font-bold mb-2">No pages yet</h3>
      <p className="text-sm mb-8 max-w-xs font-body" style={{ color: 'var(--text-2)' }}>
        Create your first VibeKit page and publish it to the world.
      </p>
      <button onClick={onNew}
        className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm glow-amber min-h-[48px] font-body"
        style={{ background: 'var(--text)', color: 'var(--bg)' }}>
        <Plus className="w-4 h-4" /> Create your first page
      </button>
    </motion.div>
  );
}

// ─── Page Card ────────────────────────────────────────────────────────────────
function PageCard({ page, view, onDuplicate, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pub = isPublished(page);
  const theme = THEMES[page.theme] || THEMES.minimal;

  return (
    <motion.div layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className={`rounded-2xl overflow-hidden card-lift ${view === 'list' ? 'flex items-center gap-4 p-4' : 'flex flex-col'}`}
      style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>

      {/* Theme color strip */}
      {view === 'grid' && (
        <div className="h-24 relative flex items-end p-4"
          style={{ background: theme.vars['--vk-bg'] }}>
          <div className="flex gap-1.5">
            {[theme.vars['--vk-accent'], theme.vars['--vk-text'], theme.vars['--vk-surface']].map((c, i) => (
              <div key={i} className="w-5 h-5 rounded-full border border-black/10" style={{ background: c }} />
            ))}
          </div>
          <span className="absolute top-3 right-3 text-base">{theme.emoji}</span>
        </div>
      )}

      <div className={`flex flex-col gap-2 flex-1 ${view === 'grid' ? 'p-4' : ''}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-semibold text-base truncate">{page.title}</h3>
            <p className="text-xs mt-0.5 font-mono truncate" style={{ color: 'var(--text-3)' }}>/{page.slug}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold font-body ${
              pub ? 'text-emerald-700' : ''
            }`}
              style={pub
                ? { background: 'rgba(16,185,129,0.12)', color: '#059669' }
                : { background: 'rgba(16,14,9,0.06)', color: 'var(--text-3)' }}>
              {pub ? 'Live' : 'Draft'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs font-body" style={{ color: 'var(--text-3)' }}>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(page.updated_at || page.created_at)}</span>
          {pub && <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{(page.view_count || 0).toLocaleString()} views</span>}
        </div>
      </div>

      <div className={`flex gap-2 ${view === 'grid' ? 'px-4 pb-4' : 'flex-shrink-0'}`}>
        <Link to={`/app/edit/${page.id}`}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all min-h-[44px] font-body"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}>
          <Edit3 className="w-3.5 h-3.5" /> Edit
        </Link>

        {pub && (
          <a href={`/p/${page.slug}`} target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center px-3 py-2 rounded-xl text-xs transition-all min-h-[44px]"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}

        <div className="relative">
          <button onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center justify-center px-3 py-2 rounded-xl text-xs transition-all min-h-[44px]"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-2)' }}>
            <MoreVertical className="w-3.5 h-3.5" />
          </button>
          <AnimatePresence>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
                  className="absolute right-0 bottom-full mb-1 z-20 w-36 rounded-xl overflow-hidden"
                  style={{ background: 'var(--surface)', border: '1px solid var(--border-hi)', boxShadow: '0 8px 32px rgba(16,14,9,0.14)' }}>
                  <button onClick={() => { onDuplicate(page.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs transition-colors font-body text-left min-h-[44px]"
                    style={{ color: 'var(--text-2)' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <Copy className="w-3.5 h-3.5" /> Duplicate
                  </button>
                  <button onClick={() => { onDelete(page.id); setMenuOpen(false); }}
                    className="flex items-center gap-2 w-full px-3 py-2.5 text-xs transition-colors font-body text-left min-h-[44px] text-red-600"
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(220,38,38,0.06)'}
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

// ─── Dashboard ────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [pagesList, setPagesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState('');
  const [view, setView] = useState('grid');

  useEffect(() => {
    pagesApi.list()
      .then(({ pages }) => setPagesList(pages || []))
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
      await pagesApi.remove(id);
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
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center transition-transform group-hover:scale-105"
                style={{ background: 'var(--text)' }}>
                <Zap className="w-4 h-4" style={{ color: 'var(--bg)' }} strokeWidth={2.5} />
              </div>
              <span className="font-display font-bold text-base hidden sm:block">VibeKit</span>
            </Link>
            <span className="hidden sm:block" style={{ color: 'var(--border-hi)' }}>/</span>
            <span className="text-sm hidden sm:block font-body" style={{ color: 'var(--text-2)' }}>Dashboard</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-sm hidden sm:block font-body" style={{ color: 'var(--text-3)' }}>
              {user?.name || user?.email?.split('@')[0]}
            </span>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all min-h-[44px] font-body"
              style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text-2)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-hi)'; e.currentTarget.style.color = 'var(--text)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-2)'; }}>
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
            <p className="text-sm mt-1.5 font-body" style={{ color: 'var(--text-3)' }}>
              {pagesList.length} page{pagesList.length !== 1 ? 's' : ''} · {published} live · {totalViews.toLocaleString()} views
            </p>
          </div>
          <button onClick={() => setCreateOpen(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold font-body glow-amber transition-all min-h-[48px] self-start sm:self-auto"
            style={{ background: 'var(--text)', color: 'var(--bg)' }}>
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
                  <Icon className="w-3.5 h-3.5" style={{ color: 'var(--gold)' }} />
                  <span className="text-xs font-medium font-body" style={{ color: 'var(--text-3)' }}>{label}</span>
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
                className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm placeholder-black/25 focus:outline-none transition-all min-h-[44px] font-body"
                style={{ background: 'var(--surface)', border: '1px solid var(--border)', color: 'var(--text)' }}
                onFocus={e => e.target.style.borderColor = 'rgba(16,14,9,0.40)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
            <div className="flex gap-1 p-1 rounded-xl" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
              {[{ id: 'grid', Icon: LayoutGrid }, { id: 'list', Icon: List }].map(({ id, Icon }) => (
                <button key={id} onClick={() => setView(id)}
                  className="flex items-center justify-center px-3 py-2 rounded-lg text-sm transition-all min-h-[44px]"
                  style={view === id
                    ? { background: 'rgba(16,14,9,0.09)', color: 'var(--text)' }
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
          <div className="text-center py-20 font-body" style={{ color: 'var(--text-3)' }}>
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