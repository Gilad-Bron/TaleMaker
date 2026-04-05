import { useState, useCallback } from "react";
import { loadAllTaleSummaries, saveTale, removeTale } from "@/lib/storage";
import { createTale } from "@/lib/factory";
import type { Tale } from "@/types/tale";

type TaleSummary = Pick<Tale, "id" | "title" | "description" | "updatedAt">;

export function useTales() {
  const [tales, setTales] = useState<TaleSummary[]>(() => loadAllTaleSummaries());

  const addTale = useCallback((title: string, description: string) => {
    const tale = createTale(title, description);
    saveTale(tale);
    setTales(loadAllTaleSummaries());
    return tale.id;
  }, []);

  const deleteTale = useCallback((id: string) => {
    removeTale(id);
    setTales(loadAllTaleSummaries());
  }, []);

  return { tales, addTale, deleteTale };
}
