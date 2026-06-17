import { useCallback, useEffect, useRef, useState } from "react";

export function useDebounce(value, times) {
  const [newval, setNewval] = useState(value);
  const ref = useRef();

  useEffect(() => {
    if (ref.current) clearTimeout(ref.current);
    ref.current = setTimeout(() => {
      setNewval(value);
    }, times);
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, [value, times]);

  return newval;
}

export function useDebounceFun(fun, times) {
  const ref = useRef(null);
  const a = useCallback(
    (...args) => {
      if (ref.current) clearTimeout(ref.current);
      ref.current = setTimeout(() => {
        fun.apply(null, args);
      }, times);
    },
    [fun, times],
  );

  useEffect(() => {
    return () => {
      if (ref.current) clearTimeout(ref.current);
    };
  }, []);

  return a;
}

export function usePrevious(value) {
  const prevRef = useRef();
  useEffect(() => {
    prevRef.current = value;
  }, [value]);
  return prevRef.current;
}

export function useThrottle(value, wait) {
  const [throttled, setThrottled] = useState(value);
  const lastRunRef = useRef(0);

  useEffect(() => {
    const now = Date.now();
    const remaining = wait - (now - lastRunRef.current);

    if (remaining <= 0) {
      lastRunRef.current = now;
      setThrottled(value);
      return;
    }

    const timer = setTimeout(() => {
      lastRunRef.current = Date.now();
      setThrottled(value);
    }, remaining);

    return () => clearTimeout(timer);
  }, [value, wait]);

  return throttled;
}

export function useThrottleFun(fun, wait) {
  const lastRunRef = useRef(0);
  const timerRef = useRef(null);

  const throttled = useCallback(
    (...args) => {
      const now = Date.now();
      const remaining = wait - (now - lastRunRef.current);

      if (remaining <= 0) {
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = null;
        lastRunRef.current = now;
        fun.apply(null, args);
        return;
      }

      if (!timerRef.current) {
        timerRef.current = setTimeout(() => {
          timerRef.current = null;
          lastRunRef.current = Date.now();
          fun.apply(null, args);
        }, remaining);
      }
    },
    [fun, wait],
  );

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return throttled;
}
