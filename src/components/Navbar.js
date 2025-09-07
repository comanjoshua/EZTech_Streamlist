/*
  Course: INT-499 Capstone in Information Technology
  Instructor: John Russel
  Joshua Coman
*/


import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { useAppState } from '../context/AppState';

export default function Navbar() {
  const { watchlist, user } = useAppState();
  const watchCount = watchlist.length;

  const linkCls = ({ isActive }) =>
    [
      'rounded-xl px-3 py-2 text-white transition',
      isActive ? 'bg-blue-700' : 'hover:bg-blue-800',
    ].join(' ');

  return (
    <header className="bg-blue-900">
      <div className="mx-auto flex max-w-5xl items-center justify-between p-4">
        <Link to="/" className="text-3xl font-bold text-white">
          StreamList
        </Link>

        <nav className="flex items-center gap-2">
          <NavLink to="/movies" className={linkCls}>Movies</NavLink>

          <NavLink to="/watchlist" className={linkCls}>
            Watchlist{user && watchCount ? (
              <span className="ml-2 rounded-lg bg-white/20 px-2 py-0.5 text-xs text-white">
                {watchCount}
              </span>
            ) : null}
          </NavLink>

          {!user && <NavLink to="/cart" className={linkCls}>Cart</NavLink>}

          <NavLink to="/about" className={linkCls}>About</NavLink>

          {user ? (
            <NavLink to="/account" className={linkCls}>Account</NavLink>
          ) : (
            <NavLink to="/login" className={linkCls}>Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
