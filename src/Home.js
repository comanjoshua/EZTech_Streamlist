import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <h1 className="mb-2 text-2xl font-bold">Welcome to StreamList</h1>
      <p className="mb-4 text-gray-700">Search for films and build a watchlist. Add a plan from the cart flow.</p>
      <div className="flex gap-3">
        <Link to="/movies" className="rounded-xl bg-indigo-600 px-4 py-2 text-white">Find Movies</Link>
        <Link to="/watchlist" className="rounded-xl bg-gray-900 px-4 py-2 text-white">Watchlist</Link>
      </div>
    </section>
  );
}
