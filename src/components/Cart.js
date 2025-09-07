import React, { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { flushSync } from 'react-dom';
import { useAppDispatch, useAppState } from '../context/AppState';
import useLocalStorage from '../hooks/useLocalStorage';
import PlanPicker from './PlanPicker';
import { priceOf, planById } from '../utils/plans';

export default function Cart() {
  const { subscription, user } = useAppState();
  const dispatch = useAppDispatch();
  const nav = useNavigate();

  const isActive = subscription?.status === 'active' && !!subscription.plan;
  const activePlanId = subscription?.plan || 'standard';

  // local select for smooth UI, keep across refresh
  const [selected, setSelected] = useLocalStorage('plan.selected', 'standard');

  // when a plan is active, lock selection to the active one
  useEffect(() => {
    if (isActive && selected !== activePlanId) {
      setSelected(activePlanId);
    }
  }, [isActive, activePlanId, selected, setSelected]);

  // sync pending pick into store only when not active
  useEffect(() => {
    if (!isActive) dispatch({ type: 'CART_SET_PLAN', plan: selected });
  }, [dispatch, selected, isActive]);

  const total = useMemo(
    () => priceOf(isActive ? activePlanId : selected),
    [isActive, activePlanId, selected]
  );
  const planMeta = planById(isActive ? activePlanId : selected);

  const mockCheckout = () => {
    if (!user) {
      nav(`/login?next=${encodeURIComponent('/cart')}`);
      return;
    }
    flushSync(() => {
      dispatch({ type: 'SUB_ACTIVATE', plan: selected });
    });
    nav('/account');
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Choose your plan</h2>

      {isActive && planMeta && (
        <div className="rounded-xl bg-green-50 p-4 text-green-800">
          You have an active plan: <strong>{planMeta.name}</strong> • ${planMeta.price.toFixed(2)}/mo
        </div>
      )}

      <PlanPicker
        value={isActive ? activePlanId : selected}
        onChange={setSelected}
        disabled={isActive}
      />

      <div className="flex items-center justify-between rounded-2xl bg-white p-4 shadow">
        <span className="font-semibold">{isActive ? 'Current charge' : 'Total due today'}</span>
        <span className="text-lg">${total.toFixed(2)}</span>
      </div>

      {isActive ? (
        <div className="flex gap-2">
          <Link to="/account" className="rounded-xl bg-gray-900 px-4 py-2 text-white">
            Account
          </Link>
          <Link to="/subscriptions" className="rounded-xl bg-indigo-600 px-4 py-2 text-white">
            Manage plan
          </Link>
        </div>
      ) : (
        <div className="flex gap-2">
          <button
            onClick={() => {
              setSelected('standard');
              dispatch({ type: 'CART_CLEAR' });
            }}
            className="rounded-xl bg-gray-300 px-4 py-2"
          >
            Clear
          </button>
          <button
            onClick={mockCheckout}
            className="rounded-xl bg-indigo-600 px-4 py-2 text-white"
          >
            Mock Checkout
          </button>
        </div>
      )}
    </section>
  );
}
