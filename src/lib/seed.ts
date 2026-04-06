import taleData from "../../data/the-lost-kingdom.json";
import type { Tale } from "@/types/tale";
import { loadTale, saveTale } from "./storage";

export function seedTales(): void {
  saveTale(taleData as Tale);
}
