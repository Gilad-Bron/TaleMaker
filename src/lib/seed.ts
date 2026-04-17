import taleData1 from "../../data/the-lost-kingdom.json";
import taleData2 from "../../data/the-seventh-messenger.json";
import type { Tale } from "@/types/tale";
import { saveTale } from "./storage";

export function seedTales(): void {
  saveTale(taleData1 as Tale);
  saveTale(taleData2 as Tale);
}
