import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../context/AppState';
import { planById } from '../utils/plans';

export default function Account() {
  const { user, subscription } = useAppState();
  const dispatch = useAppDispatch();
  const nav = useNavigate();
  const plan = subscription?.plan ? planById(subscription.plan) : null;

  const signOut = () => {
    dispatch({ type: 'LOGOUT' }); // keeps plan by design; watchlist clears per reducer
    nav('/');
  };

  const cancelAccount = () => {
    // full local wipe: profile, app state, plan, watchlist, cart
    try {
      localStorage.removeItem('streamlist.app.v1');
      localStorage.removeItem('streamlist.profile');
    } catch {}
    dispatch({ type: 'RESET_ALL' });
    nav('/');
  };

  return (
    <section className="mx-auto max-w-lg space-y-4 rounded-2xl bg-white p-6 shadow">
      <h2 className="text-xl font-semibold">Account</h2>

      <p className="text-gray-800">
        Signed in as <strong>{user?.name || 'User'}</strong>
      </p>

      <div className="rounded-2xl bg-gray-50 p-4">
        {subscription?.status === 'active' && plan ? (
          <>
            <p>
              Plan: <strong>{plan.name}</strong> • ${plan.price.toFixed(2)}/mo
            </p>
            <p className="mt-1 text-sm text-gray-600">
              {plan.quality} • {plan.screens} screen{plan.screens > 1 ? 's' : ''}
            </p>
          </>
        ) : (
          <p>No active plan</p>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <Link to="/subscriptions?edit=1" className="rounded-xl bg-gray-900 px-4 py-2 text-white">
          Manage plan
        </Link>
        <button onClick={signOut} className="rounded-xl bg-gray-300 px-4 py-2">
          Sign out
        </button>
        <button
          onClick={cancelAccount}
          className="rounded-xl bg-red-600 px-4 py-2 text-white"
        >
          Cancel account
        </button>
      </div>
    </section>
  );
}
