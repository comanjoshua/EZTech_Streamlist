import React from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../context/AppState';
import Poster from './Poster';

export default function Watchlist() {
  const { user, watchlist } = useAppState();
  const dispatch = useAppDispatch();

  if (!user) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold">Watchlist</h2>
        <p className="mt-1 text-gray-700">Sign in to view and manage your list.</p>
        <Link to="/login" className="mt-3 inline-block rounded-xl bg-gray-900 px-4 py-2 text-white">
          Sign in
        </Link>
      </section>
    );
  }

  if (!watchlist.length) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="text-xl font-semibold">Watchlist</h2>
        <p className="mt-1 text-gray-700">No titles yet.</p>
        <Link to="/movies" className="mt-3 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-white">
          Find movies
        </Link>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold">Watchlist</h2>
      {watchlist.map((m) => (
        <div key={m.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow">
          <a href={`/movie/${m.id}`} className="block">
            <Poster
              src={m.poster}
              alt={m.title}
              w={64}
              h={96}
              className="h-24 w-16 flex-shrink-0 rounded object-cover transition hover:opacity-90"
            />
          </a>
          <div className="flex-1">
            <div className="font-medium">{m.title}</div>
            <div className="text-sm text-gray-600">{m.year}</div>
          </div>
          <button
            onClick={() => dispatch({ type: 'WATCH_REMOVE', id: m.id })}
            className="rounded-xl bg-red-600 px-3 py-2 text-white"
          >
            Remove
          </button>
        </div>
      ))}
    </section>
  );
}
