import { useState, useEffect, useCallback, useRef } from "react";
import { loadTale, saveTale } from "@/lib/storage";
import type { Tale } from "@/types/tale";

export function useTale(id: string) {
  const [tale, setTale] = useState<Tale | null>(null);
  const taleRef = useRef(tale);
  taleRef.current = tale;

  useEffect(() => {
    setTale(loadTale(id));
  }, [id]);

  // Debounced auto-save
  useEffect(() => {
    if (!tale) return;
    const timeout = setTimeout(() => {
      saveTale(tale);
    }, 500);
    return () => clearTimeout(timeout);
  }, [tale]);

  const updateTale = useCallback((updater: (tale: Tale) => Tale) => {
    setTale((prev) => (prev ? updater(prev) : prev));
  }, []);

  return { tale, updateTale };
}
