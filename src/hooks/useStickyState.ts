import { useState, useEffect } from 'react'

export const useStickyState = <T>(defaultValue: T, key: string): [T, (val: T) => void] => {
  if (typeof window === 'undefined') return [defaultValue, () => {}]

  const [value, setValue] = useState<T>(() => {
    const stickyValue = window.localStorage.getItem(key);
    return stickyValue !== null
      ? JSON.parse(stickyValue)
      : defaultValue;
  });
  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}
