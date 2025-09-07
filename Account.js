import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../context/AppState';

export default function Account() {
  const { user, subscription } = useAppState();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const signOut = () => {
    dispatch({ type: 'LOGOUT' });
    nav('/');
  };

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Account</h2>
      <p className="text-gray-800">Signed in as <strong>{user?.name || 'User'}</strong></p>

      <div className="rounded-xl bg-gray-50 p-4">
        {subscription?.status === 'active' ? (
          <p>
            Plan: <strong>{subscription.plan}</strong> (active)
          </p>
        ) : (
          <p>No active plan</p>
        )}
      </div>

      <div className="flex gap-2">
        <Link to="/subscriptions" className="rounded-xl bg-gray-900 px-4 py-2 text-white">Manage plan</Link>
        <button onClick={signOut} className="rounded-xl bg-red-600 px-4 py-2 text-white">Sign out</button>
      </div>
    </section>
  );
}
