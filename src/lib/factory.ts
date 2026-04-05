import { v4 as uuid } from "uuid";
import type { Dialog, DialogOption, Interaction, Episode, Chapter, Tale } from "@/types/tale";

export function createOption(label = "Continue"): DialogOption {
  return { id: uuid(), label };
}

export function createDialog(): Dialog {
  return {
    id: uuid(),
    text: "",
    options: [createOption()],
  };
}

export function createInteraction(type: "character" | "area" = "character"): Interaction {
  return {
    id: uuid(),
    type,
    name: type === "character" ? "New Character" : "New Area",
    dialogs: [createDialog()],
  };
}

export function createEpisode(): Episode {
  return {
    id: uuid(),
    title: "New Episode",
    description: "",
    interactions: [createInteraction()],
  };
}

export function createChapter(): Chapter {
  return {
    id: uuid(),
    title: "New Chapter",
    description: "",
    episodes: [createEpisode()],
  };
}

export function createTale(title: string, description = ""): Tale {
  const now = new Date().toISOString();
  return {
    id: uuid(),
    title,
    description,
    chapters: [createChapter()],
    createdAt: now,
    updatedAt: now,
  };
}
