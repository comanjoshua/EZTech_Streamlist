import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../context/AppState';

const PROFILE_KEY = 'streamlist.profile';

export default function Login() {
  const [name, setName] = useState('');
  const { user } = useAppState();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  // Prefill from last profile
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem(PROFILE_KEY));
      if (p?.name) setName(p.name);
    } catch {}
  }, []);

  // If already signed in, go to Movies
  useEffect(() => {
    if (user) nav('/movies', { replace: true });
  }, [user, nav]);

  const submit = (e) => {
    e.preventDefault();
    const displayName = (name || '').trim() || 'User';

    // stable id per device
    let id = `u-${displayName.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;
    try {
      const prev = JSON.parse(localStorage.getItem(PROFILE_KEY));
      if (prev?.id) id = prev.id;
    } catch {}

    dispatch({ type: 'LOGIN', user: { id, name: displayName } });

    try {
      localStorage.setItem(PROFILE_KEY, JSON.stringify({ id, name: displayName }));
    } catch {}

    nav('/movies', { replace: true }); // always go to Movies
  };

  return (
    <section className="mx-auto max-w-md rounded-2xl bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Sign in</h2>
      <form onSubmit={submit} className="space-y-3">
        <label className="block">
          <span className="mb-1 block text-sm text-gray-700">Name</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-gray-300 p-3"
            placeholder="Your name"
            autoFocus
          />
        </label>
        <button type="submit" className="w-full rounded-xl bg-gray-900 px-4 py-2 text-white">
          Continue
        </button>
      </form>
    </section>
  );
}
