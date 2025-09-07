/*
  Course: INT-499 Capstone in Information Technology
  Instructor: John Russel
  Joshua Coman
*/

import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navbar />
      <main className="mx-auto max-w-5xl p-4">
        <Outlet />
      </main>
    </div>
  );
}
