import React, { createContext, useReducer, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const CartStateCtx = createContext(null);
const CartDispatchCtx = createContext(null);

const initial = { items: [] };

function reducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.item.id && i.plan === action.item.plan);
      if (exists) return state;
      return { ...state, items: [...state.items, action.item] };
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => !(i.id === action.id && i.plan === action.plan)) };
    case 'CLEAR':
      return { ...state, items: [] };
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initial);
  const value = useMemo(() => state, [state]);
  return (
    <CartStateCtx.Provider value={value}>
      <CartDispatchCtx.Provider value={dispatch}>{children}</CartDispatchCtx.Provider>
    </CartStateCtx.Provider>
  );
}
CartProvider.propTypes = { children: PropTypes.node };

export function useCart() {
  const ctx = useContext(CartStateCtx);
  if (!ctx) throw new Error('useCart outside provider');
  return ctx;
}
export function useCartDispatch() {
  const ctx = useContext(CartDispatchCtx);
  if (!ctx) throw new Error('useCartDispatch outside provider');
  return ctx;
}
