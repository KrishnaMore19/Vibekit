// src/pages/PublishedPage.jsx
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, AlertCircle } from 'lucide-react';
import { publicApi } from '../lib/api';
import ThemedPage from '../components/preview/ThemedPage';

function Skeleton() {
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center gap-6">
      <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
      <div className="flex flex-col gap-3 w-full max-w-2xl px-4">
        <div className="skeleton h-8 w-64 rounded-lg mx-auto" />
        <div className="skeleton h-4 w-96 max-w-full rounded mx-auto" />
        <div className="skeleton h-4 w-80 max-w-full rounded mx-auto" />
        <div className="skeleton h-11 w-32 rounded-lg mx-auto mt-4" />
      </div>
    </div>
  );
}

function NotFound({ slug }) {
  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-6 text-center">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md">
        <div className="w-16 h-16 rounded-2xl glass flex items-center justify-center mx-auto mb-6">
          <AlertCircle className="w-8 h-8 text-red-400" />
        </div>
        <h1 className="font-display text-3xl font-bold mb-3">Page not found</h1>
        <p className="text-white/50 mb-2">
          The page <code className="text-violet-400 font-mono bg-white/5 px-1.5 py-0.5 rounded">/{slug}</code> doesn't exist or hasn't been published yet.
        </p>
        <p className="text-white/30 text-sm mb-8">
          Check the URL or ask the page owner to publish it.
        </p>
        <Link to="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-violet-600 hover:bg-violet-500 rounded-xl font-semibold transition-all glow-violet">
          <Zap className="w-4 h-4" /> Build your own page
        </Link>
      </motion.div>
    </div>
  );
}

export default function PublishedPage() {
  const { slug } = useParams();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    // Fetch page data
    publicApi.getPage(slug)
      .then(({ page }) => {
        setPage(page);
        // Track view (fire and forget)
        publicApi.trackView(slug).catch(() => {});
      })
      .catch(err => {
        if (err.status === 404) setNotFound(true);
        else setNotFound(true);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return <Skeleton />;
  if (notFound || !page) return <NotFound slug={slug} />;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
      <ThemedPage page={page} isPreview={false} />
    </motion.div>
  );
}
