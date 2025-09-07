import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../utils/api';
import { useAppDispatch, useAppState } from '../context/AppState';
import Spinner from './Spinner';

export default function MovieDetails() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [status, setStatus] = useState('loading'); // loading | done | error
  const ctlRef = useRef(null);

  const dispatch = useAppDispatch();
  const { watchlist } = useAppState();

  useEffect(() => {
    if (!id) return;
    if (ctlRef.current) ctlRef.current.abort();
    const ctl = new AbortController();
    ctlRef.current = ctl;

    setStatus('loading');
    getMovieDetails(id, ctl.signal)
      .then(setMovie)
      .then(() => setStatus('done'))
      .catch(err => {
        if (err.name !== 'AbortError') setStatus('error');
      });

    return () => ctl.abort();
  }, [id]);

  const inWatchlist = movie
    ? watchlist.some(w => String(w.id) === String(movie.id))
    : false;

  const addToWatch = () => {
    if (!movie) return;
    const item = { id: movie.id, title: movie.title, year: movie.year, poster: movie.poster };
    dispatch({ type: 'WATCH_ADD', item });
  };

  if (status === 'loading') return <Spinner />;
  if (status === 'error' || !movie) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold">Movie not found</h2>
        <p className="text-gray-700 mt-1">Try another title from search.</p>
      </section>
    );
  }

  return (
    <article className="overflow-hidden rounded-2xl bg-white shadow">
      {movie.backdrop && (
        <img
          src={movie.backdrop}
          alt=""
          className="h-56 w-full object-cover"
          loading="eager"
        />
      )}

      <div className="grid gap-6 p-6 sm:grid-cols-[120px,1fr]">
        <img
          src={movie.poster || 'https://placehold.co/120x180?text=No+Poster'}
          alt={movie.title}
          className="h-44 w-28 rounded object-cover sm:h-60 sm:w-40"
        />

        <div>
          <h1 className="text-2xl font-bold">{movie.title}</h1>
          <p className="text-gray-700 mt-1">
            {movie.year || '—'}
            {movie.runtime ? ` • ${movie.runtime} min` : ''}
            {movie.genres?.length ? ` • ${movie.genres.join(', ')}` : ''}
          </p>
          {typeof movie.rating === 'number' && (
            <p className="mt-1 text-sm text-gray-600">TMDB score: {movie.rating.toFixed(1)}</p>
          )}

          <p className="mt-4 text-gray-800">{movie.overview || 'No overview yet.'}</p>

          <div className="mt-6 flex gap-2">
            <button
              onClick={addToWatch}
              disabled={inWatchlist}
              className={`rounded-xl px-4 py-2 text-white ${
                inWatchlist ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-900'
              }`}
              title={inWatchlist ? 'Already in watchlist' : 'Add to watchlist'}
            >
              {inWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
