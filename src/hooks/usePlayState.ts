import { useState, useMemo, useCallback } from "react";
import type { Tale, Dialog } from "@/types/tale";

interface PlayPosition {
  chapterIndex: number;
  episodeIndex: number;
  interactionIndex: number;
  dialogIndex: number;
}

interface PlayState {
  currentDialog: Dialog | null;
  interactionName: string;
  interactionType: "character" | "area";
  chapterTitle: string;
  episodeTitle: string;
  isComplete: boolean;
  advance: () => void;
  position: PlayPosition;
}

export function usePlayState(tale: Tale | null): PlayState {
  const [position, setPosition] = useState<PlayPosition>({
    chapterIndex: 0,
    episodeIndex: 0,
    interactionIndex: 0,
    dialogIndex: 0,
  });
  const [isComplete, setIsComplete] = useState(false);

  const current = useMemo(() => {
    if (!tale || isComplete) {
      return { dialog: null, interactionName: "", interactionType: "character" as const, chapterTitle: "", episodeTitle: "" };
    }
    const chapter = tale.chapters[position.chapterIndex];
    if (!chapter) return { dialog: null, interactionName: "", interactionType: "character" as const, chapterTitle: "", episodeTitle: "" };
    const episode = chapter.episodes[position.episodeIndex];
    if (!episode) return { dialog: null, interactionName: "", interactionType: "character" as const, chapterTitle: "", episodeTitle: "" };
    const interaction = episode.interactions[position.interactionIndex];
    if (!interaction) return { dialog: null, interactionName: "", interactionType: "character" as const, chapterTitle: "", episodeTitle: "" };
    const dialog = interaction.dialogs[position.dialogIndex] ?? null;
    return {
      dialog,
      interactionName: interaction.name,
      interactionType: interaction.type,
      chapterTitle: chapter.title,
      episodeTitle: episode.title,
    };
  }, [tale, position, isComplete]);

  const advance = useCallback(() => {
    if (!tale || isComplete) return;

    setPosition((pos) => {
      const chapter = tale.chapters[pos.chapterIndex];
      if (!chapter) { setIsComplete(true); return pos; }
      const episode = chapter.episodes[pos.episodeIndex];
      if (!episode) { setIsComplete(true); return pos; }
      const interaction = episode.interactions[pos.interactionIndex];
      if (!interaction) { setIsComplete(true); return pos; }

      // Try next dialog
      if (pos.dialogIndex < interaction.dialogs.length - 1) {
        return { ...pos, dialogIndex: pos.dialogIndex + 1 };
      }
      // Try next interaction
      if (pos.interactionIndex < episode.interactions.length - 1) {
        return { ...pos, interactionIndex: pos.interactionIndex + 1, dialogIndex: 0 };
      }
      // Try next episode
      if (pos.episodeIndex < chapter.episodes.length - 1) {
        return { ...pos, episodeIndex: pos.episodeIndex + 1, interactionIndex: 0, dialogIndex: 0 };
      }
      // Try next chapter
      if (pos.chapterIndex < tale.chapters.length - 1) {
        return { ...pos, chapterIndex: pos.chapterIndex + 1, episodeIndex: 0, interactionIndex: 0, dialogIndex: 0 };
      }
      // Done
      setIsComplete(true);
      return pos;
    });
  }, [tale, isComplete]);

  return {
    currentDialog: current.dialog,
    interactionName: current.interactionName,
    interactionType: current.interactionType,
    chapterTitle: current.chapterTitle,
    episodeTitle: current.episodeTitle,
    isComplete,
    advance,
    position,
  };
}
