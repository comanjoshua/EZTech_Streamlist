/*
  Course: INT-499 Capstone in Information Technology
  Instructor: John Russel
  Joshua Coman
*/

import React from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppStateProvider } from './context/AppState';
import DevErrorBoundary from './DevErrorBoundary';
import App from './App';
import Movies from './components/Movies';
import MovieDetails from './components/MovieDetails';
import Watchlist from './components/Watchlist';
import Cart from './components/Cart';
import Subscriptions from './components/Subscriptions';
import Account from './components/Account';
import About from './components/About';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import './index.css';

const router = createBrowserRouter(
  [
    {
      element: <App />,
      children: [
        { index: true, element: <Navigate to="/movies" replace /> },
        { path: '/movies', element: <Movies /> },
        { path: '/movie/:id', element: <MovieDetails /> },
        { path: '/about', element: <About /> },
        { path: '*', element: <div className="p-6">Page not found</div> },

        // signed-out flow
        { path: '/cart', element: <Cart /> },
        { path: '/login', element: <Login /> },
        

        // signed-in pages
        {
          path: '/account',
          element: (
            <ProtectedRoute>
              <Account />
            </ProtectedRoute>
          ),
        },
        {
          path: '/subscriptions',
          element: (
            <ProtectedRoute>
              <Subscriptions />
            </ProtectedRoute>
          ),
        },
        {
          path: '/watchlist',
          element: (
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  { future: { v7_startTransition: true, v7_relativeSplatPath: true } }
);

createRoot(document.getElementById('root')).render(
  <AppStateProvider>
    <DevErrorBoundary>
      <RouterProvider router={router} />
    </DevErrorBoundary>
  </AppStateProvider>
);
