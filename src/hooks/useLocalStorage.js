import { useEffect, useState } from 'react';

export default function useLocalStorage(key, initialValue) {
  const [val, setVal] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw !== null ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      /* ignore write errors */
    }
  }, [key, val]);

  return [val, setVal];
}
