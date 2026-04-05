import type { Tale } from "@/types/tale";

const INDEX_KEY = "tales_index";
const taleKey = (id: string) => `tale_${id}`;

export function loadTaleIds(): string[] {
  const raw = localStorage.getItem(INDEX_KEY);
  return raw ? JSON.parse(raw) : [];
}

export function loadTale(id: string): Tale | null {
  const raw = localStorage.getItem(taleKey(id));
  return raw ? JSON.parse(raw) : null;
}

export function loadAllTaleSummaries(): Pick<Tale, "id" | "title" | "description" | "updatedAt">[] {
  return loadTaleIds()
    .map((id) => {
      const tale = loadTale(id);
      if (!tale) return null;
      return { id: tale.id, title: tale.title, description: tale.description, updatedAt: tale.updatedAt };
    })
    .filter((t): t is NonNullable<typeof t> => t !== null);
}

export function saveTale(tale: Tale): void {
  tale.updatedAt = new Date().toISOString();
  localStorage.setItem(taleKey(tale.id), JSON.stringify(tale));

  const ids = loadTaleIds();
  if (!ids.includes(tale.id)) {
    ids.push(tale.id);
    localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
  }
}

export function removeTale(id: string): void {
  localStorage.removeItem(taleKey(id));
  const ids = loadTaleIds().filter((i) => i !== id);
  localStorage.setItem(INDEX_KEY, JSON.stringify(ids));
}
