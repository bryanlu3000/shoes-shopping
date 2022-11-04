import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => {
    const stored = localStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
  // return [value, setValue] as [typeof value, typeof setValue];
};
