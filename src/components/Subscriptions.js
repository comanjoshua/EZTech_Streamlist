import React, { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppState } from '../context/AppState';
import { planById, PLANS } from '../utils/plans';
import PlanPicker from './PlanPicker';

const EMPTY_SUB = { plan: null, status: 'none', startedAt: null };

export default function Subscriptions() {
  const state = useAppState() || {};
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();

  const user = state.user || null;
  const subscription = state.subscription || EMPTY_SUB;

  const hasActive = subscription.status === 'active' && !!subscription.plan;
  const currentPlanId = subscription.plan || 'standard';
  const currentPlan = useMemo(() => planById(currentPlanId), [currentPlanId]);

  // edit mode for change flow
  const [edit, setEdit] = useState(false);
  const [selected, setSelected] = useState(currentPlanId);

  // allow direct open via ?edit=1
  useEffect(() => {
    if (params.get('edit') === '1' && hasActive) setEdit(true);
  }, [params, hasActive]);

  useEffect(() => {
    setSelected(currentPlanId);
  }, [currentPlanId]);

  if (!user) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="mb-2 text-xl font-semibold">Subscriptions</h2>
        <p className="text-gray-700">Sign in to manage plans.</p>
      </section>
    );
  }

  if (!hasActive) {
    return (
      <section className="rounded-2xl bg-white p-8 shadow">
        <h2 className="mb-2 text-xl font-semibold">Subscriptions</h2>
        <p className="text-gray-700">No active plan.</p>
        <Link to="/cart" className="mt-3 inline-block rounded-xl bg-indigo-600 px-4 py-2 text-white">
          Pick a plan
        </Link>
      </section>
    );
  }

  const saveChange = () => {
    if (selected === currentPlanId) {
      setEdit(false);
      return;
    }
    dispatch({ type: 'SUB_ACTIVATE', plan: selected });
    try { localStorage.setItem('plan.selected', JSON.stringify(selected)); } catch {}
    setEdit(false);
  };

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">Your plan</h2>

      {!edit && currentPlan && (
        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-800">
            <strong>{currentPlan.name}</strong> • ${currentPlan.price.toFixed(2)}/mo
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {currentPlan.quality} • {currentPlan.screens} screen{currentPlan.screens > 1 ? 's' : ''}
          </p>
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => setEdit(true)}
              className="rounded-xl bg-gray-900 px-4 py-2 text-white"
            >
              Change plan
            </button>
            <button
              onClick={() => dispatch({ type: 'SUB_CANCEL' })}
              className="rounded-xl bg-red-600 px-4 py-2 text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {edit && (
        <div className="space-y-4 rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-800 font-medium">Select a plan</p>
          <PlanPicker value={selected} onChange={setSelected} />
          <div className="flex gap-2">
            <button
              onClick={saveChange}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-white"
            >
              Save changes
            </button>
            <button
              onClick={() => { setSelected(currentPlanId); setEdit(false); }}
              className="rounded-xl bg-gray-300 px-4 py-2"
            >
              Cancel
            </button>
          </div>
          <div className="text-sm text-gray-600">
            Current: <strong>{currentPlan?.name}</strong>. Options:
            {' '}
            {PLANS.map(p => p.name).join(' • ')}
          </div>
        </div>
      )}
    </section>
  );
}
