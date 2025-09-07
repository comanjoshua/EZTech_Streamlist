import React from 'react';
import PropTypes from 'prop-types';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppState } from '../context/AppState';

export default function ProtectedRoute({ children }) {
  const { user } = useAppState();
  const loc = useLocation();

  if (!user) {
    const next = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return children;
}

ProtectedRoute.propTypes = { children: PropTypes.node };
