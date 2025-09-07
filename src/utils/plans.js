export const PLANS = [
  { id: 'basic',    name: 'Basic',    price: 9.99,  quality: 'HD',      screens: 1 },
  { id: 'standard', name: 'Standard', price: 15.49, quality: 'Full HD', screens: 2 },
  { id: 'premium',  name: 'Premium',  price: 19.99, quality: 'Ultra HD',screens: 4 },
];

export const priceOf  = id => (PLANS.find(p => p.id === id)?.price ?? 0);
export const planById = id => PLANS.find(p => p.id === id) || null;
