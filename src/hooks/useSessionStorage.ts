import { useState, useEffect } from "react";

export const useSessionStorage = <T>(key: string, initialValue: T) => {
  const [value, setValue] = useState(() => {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      return JSON.parse(stored);
    } else {
      return initialValue;
    }
  });

  useEffect(() => {
    sessionStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
  // return [value, setValue] as [typeof value, typeof setValue];
};
