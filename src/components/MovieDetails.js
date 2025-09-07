import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { getMovieDetails } from '../utils/api';
import { useAppDispatch, useAppState } from '../context/AppState';
import Spinner from './Spinner';
import Poster from './Poster';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | done | error
  const ctlRef = useRef(null);

  const dispatch = useAppDispatch();
  const { watchlist, user } = useAppState();
  const nav = useNavigate();
  const loc = useLocation();

  useEffect(() => {
    if (!id) return;
    if (ctlRef.current) ctlRef.current.abort();
    const ctl = new AbortController();
    ctlRef.current = ctl;

    setStatus('loading');
    getMovieDetails(id, ctl.signal)
      .then((m) => { setMovie(m); setStatus('done'); })
      .catch((err) => {
        if (err.name !== 'AbortError') setStatus('error');
      });

    return () => ctl.abort();
  }, [id]);

  const inWatch = movie ? watchlist.some(w => String(w.id) === String(movie.id)) : false;

  const addToWatch = () => {
    if (!movie) return;
    if (!user) {
      nav(`/login?next=${encodeURIComponent(loc.pathname)}`);
      return;
    }
    dispatch({ type: 'WATCH_ADD', item: { id: movie.id, title: movie.title, year: movie.year, poster: movie.poster } });
  };

  if (status === 'loading') return <Spinner />;

  if (status === 'error' || !movie) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <Link
          to="/movies"
          className="mb-4 inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-white hover:bg-gray-800"
        >
          ← Back to results
        </Link>
        <h2 className="text-xl font-semibold">Movie not found</h2>
        <p className="mt-1 text-gray-700">Try another title from search.</p>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <Link
        to="/movies"
        className="inline-flex items-center rounded-xl bg-gray-900 px-3 py-2 text-white hover:bg-gray-800"
      >
        ← Back to results
      </Link>

      <article className="overflow-hidden rounded-2xl bg-white shadow">
        {movie.backdrop && (
          <img
            src={movie.backdrop}
            alt=""
            className="h-56 w-full object-cover"
            loading="eager"
            referrerPolicy="no-referrer"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}

        <div className="grid gap-6 p-6 sm:grid-cols-[120px,1fr]">
          <Poster
            src={movie.poster}
            alt={movie.title}
            w={120}
            h={180}
            className="h-44 w-28 rounded object-cover sm:h-60 sm:w-40"
          />

          <div>
            <h1 className="text-2xl font-bold">{movie.title}</h1>
            <p className="mt-1 text-gray-700">
              {movie.year || '—'}
              {movie.runtime ? ` • ${movie.runtime} min` : ''}
              {movie.genres?.length ? ` • ${movie.genres.join(', ')}` : ''}
            </p>
            {typeof movie.rating === 'number' && (
              <p className="mt-1 text-sm text-gray-600">TMDB score: {movie.rating.toFixed(1)}</p>
            )}

            <p className="mt-4 text-gray-800">{movie.overview || 'No overview yet.'}</p>

            <div className="mt-6">
              <button
                onClick={addToWatch}
                disabled={inWatch}
                className={`rounded-xl px-4 py-2 text-white ${inWatch ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900'}`}
                title={user ? 'Add to watchlist' : 'Sign in to add'}
              >
                {inWatch ? 'In Watchlist' : 'Add to Watchlist'}
              </button>
            </div>
          </div>
        </div>
      </article>
    </section>
  );
}
