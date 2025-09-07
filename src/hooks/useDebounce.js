import { useEffect, useMemo, useState } from 'react';

export default function useDebounce(value, ms = 300) {
  const [v, setV] = useState(value);
  const delay = useMemo(() => ms, [ms]);

  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);

  return v;
}
