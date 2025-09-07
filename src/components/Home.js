import React from 'react';
import { Link } from 'react-router-dom';
import { useAppState } from '../context/AppState';

export default function Home() {
  const { user, subscription, watchlist } = useAppState();
  const hasPlan = subscription?.status === 'active' && !!subscription.plan;

  return (
    <section className="rounded-2xl bg-white p-8 shadow">
      <h1 className="text-2xl font-bold">Welcome to StreamList</h1>

      <p className="mt-2 text-gray-700">Search for films and build a watchlist.</p>
      {hasPlan ? (
        <p className="mt-1 text-green-700">Your plan is active. Start watching.</p>
      ) : (
        <p className="mt-1 text-gray-700">Choose a plan in Cart to stream all titles.</p>
      )}

      <div className="mt-6 flex flex-wrap gap-2">
        <Link to="/movies" className="rounded-xl bg-gray-900 px-4 py-2 text-white">
          Browse movies
        </Link>

        <Link to="/watchlist" className="rounded-xl bg-gray-300 px-4 py-2">
          Watchlist{watchlist.length ? ` (${watchlist.length})` : ''}
        </Link>

        {hasPlan ? (
          <>
            <Link to="/account" className="rounded-xl bg-indigo-600 px-4 py-2 text-white">
              Account
            </Link>
            <Link
              to="/subscriptions?edit=1"
              className="rounded-xl border border-indigo-200 bg-indigo-50 px-4 py-2 text-indigo-700"
            >
              Manage plan
            </Link>
          </>
        ) : (
          <>
            <Link to="/cart" className="rounded-xl bg-indigo-600 px-4 py-2 text-white">
              Go to Cart
            </Link>
            {!user && (
              <Link to="/login" className="rounded-xl border px-4 py-2">
                Sign in
              </Link>
            )}
          </>
        )}
      </div>
    </section>
  );
}
