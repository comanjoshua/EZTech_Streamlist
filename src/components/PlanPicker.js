import React from 'react';
import PropTypes from 'prop-types';
import { PLANS } from '../utils/plans';

export default function PlanPicker({ value, onChange, disabled = false }) {
  return (
    <div role="radiogroup" aria-label="Plans" className="grid gap-3 sm:grid-cols-3">
      {PLANS.map(p => {
        const active = value === p.id;
        const click = () => {
          if (disabled) return;
          onChange(p.id);
        };
        return (
          <button
            key={p.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-disabled={disabled}
            onClick={click}
            className={[
              'w-full rounded-2xl border p-4 text-left transition',
              'focus:outline-none focus:ring-2 focus:ring-indigo-500',
              active ? 'border-indigo-600 bg-indigo-50' : 'border-gray-300 bg-white hover:border-gray-400',
              disabled ? 'opacity-60 pointer-events-none' : 'cursor-pointer'
            ].join(' ')}
          >
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-semibold">{p.name}</h3>
              <span className="text-lg">${p.price.toFixed(2)}/mo</span>
            </div>
            <p className="mt-1 text-sm text-gray-700">
              {p.quality} • {p.screens} screen{p.screens > 1 ? 's' : ''}
            </p>
          </button>
        );
      })}
    </div>
  );
}

PlanPicker.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
};
