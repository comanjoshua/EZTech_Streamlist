import React, { useEffect, useRef, useState } from 'react';
import { searchMovies, HAS_AUTH } from '../utils/api';
import MovieCard from './MovieCard';

export default function Movies() {
  const [q, setQ] = useState(() => localStorage.getItem('movies:last_q') || '');
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [debugMsg, setDebugMsg] = useState('');
  const tRef = useRef(null);
  const ctlRef = useRef(null);

  useEffect(() => {
    // save last query
    try { localStorage.setItem('movies:last_q', q); } catch {}

    if (tRef.current) clearTimeout(tRef.current);
    if (ctlRef.current) ctlRef.current.abort();

    const trimmed = q.trim();
    if (!trimmed) {
      setList([]);
      setLoading(false);
      setDebugMsg('');
      return;
    }

    setLoading(true);
    setDebugMsg('');
    tRef.current = setTimeout(async () => {
      const ctl = new AbortController();
      ctlRef.current = ctl;
      try {
        const res = await searchMovies(trimmed, ctl.signal);
        setList(Array.isArray(res) ? res : []);
        setDebugMsg(!HAS_AUTH ? 'Demo data active' : '');
      } catch (e) {
        setList([]);
        setDebugMsg(`Search error: ${e?.message || 'unknown'}`);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => {
      if (tRef.current) clearTimeout(tRef.current);
      if (ctlRef.current) ctlRef.current.abort();
    };
  }, [q]);

  return (
    <section className="space-y-4">
      {!HAS_AUTH && (
        <div className="rounded-xl bg-yellow-50 p-3 text-sm text-yellow-900">
          Using demo data. Add a TMDB key or token in <code>.env.local</code>.
        </div>
      )}

      <div className="rounded-2xl bg-white p-4 shadow">
        <label className="block">
          <span className="mb-1 block text-sm text-gray-700">Search</span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Movie title"
            className="w-full rounded-xl border border-gray-300 p-3"
            autoFocus
          />
        </label>
      </div>

      {loading && <div className="rounded-2xl bg-white p-4 shadow">Loading…</div>}

      {debugMsg && !loading && (
        <div className="rounded-2xl bg-white p-4 text-sm text-gray-700 shadow">{debugMsg}</div>
      )}

      {!loading && !list.length && q.trim() && !debugMsg && (
        <div className="rounded-2xl bg-white p-4 shadow">No results</div>
      )}

      <div className="grid gap-3">
        {list.map(m => <MovieCard key={m.id} movie={m} />)}
      </div>
    </section>
  );
}
