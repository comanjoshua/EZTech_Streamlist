import React, { createContext, useContext, useEffect, useMemo, useReducer } from 'react';
import PropTypes from 'prop-types';

const AppStateCtx = createContext(null);
const AppDispatchCtx = createContext(null);

const STORAGE_KEY = 'streamlist.app.v1';

const DEFAULT_STATE = {
  user: null,
  watchlist: [],
  cart: [], // pending plan pick only
  subscription: { plan: null, status: 'none', startedAt: null },
};

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? { ...DEFAULT_STATE, ...JSON.parse(raw) } : DEFAULT_STATE;
  } catch {
    return DEFAULT_STATE;
  }
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOGIN':
      return { ...state, user: action.user };

    // clear watchlist on logout
    case 'LOGOUT':
      return { ...state, user: null, cart: [], watchlist: [] };

    // optional full wipe button uses this
    case 'RESET_ALL':
      return { ...DEFAULT_STATE };

    // watchlist
    case 'WATCH_ADD':
      if (state.watchlist.find(m => m.id === action.item.id)) return state;
      return { ...state, watchlist: [...state.watchlist, action.item] };
    case 'WATCH_REMOVE':
      return { ...state, watchlist: state.watchlist.filter(m => m.id !== action.id) };

    // plan selection
    case 'CART_SET_PLAN':
      return { ...state, cart: [{ id: 'subscription', title: 'StreamList Plan', plan: action.plan }] };
    case 'CART_CLEAR':
      return { ...state, cart: [] };

    // subscription
    case 'SUB_ACTIVATE':
      return { ...state, subscription: { plan: action.plan, status: 'active', startedAt: Date.now() }, cart: [] };
    case 'SUB_CANCEL':
      return { ...state, subscription: { plan: null, status: 'none', startedAt: null } };

    default:
      return state;
  }
}

export function AppStateProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadState);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
  }, [state]);

  const value = useMemo(() => state, [state]);

  return (
    <AppStateCtx.Provider value={value}>
      <AppDispatchCtx.Provider value={dispatch}>{children}</AppDispatchCtx.Provider>
    </AppStateCtx.Provider>
  );
}
AppStateProvider.propTypes = { children: PropTypes.node };

export function useAppState() {
  const ctx = useContext(AppStateCtx);
  if (!ctx) throw new Error('useAppState outside provider');
  return ctx;
}
export function useAppDispatch() {
  const ctx = useContext(AppDispatchCtx);
  if (!ctx) throw new Error('useAppDispatch outside provider');
  return ctx;
}
