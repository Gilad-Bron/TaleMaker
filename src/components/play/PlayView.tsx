import type { Tale } from "@/types/tale";
import { usePlayState } from "@/hooks/usePlayState";
import DialogDisplay from "./DialogDisplay";
import PlayComplete from "./PlayComplete";

interface PlayViewProps {
  tale: Tale;
  onBackToEditor: () => void;
}

export default function PlayView({ tale, onBackToEditor }: PlayViewProps) {
  const {
    currentDialog,
    interactionName,
    interactionType,
    chapterTitle,
    episodeTitle,
    isComplete,
    advance,
    history,
    skillDice,
    recordSkillSuccess,
  } = usePlayState(tale);

  if (isComplete || !currentDialog) {
    return <PlayComplete taleTitle={tale.title} onBackToEditor={onBackToEditor} />;
  }

  return (
    <DialogDisplay
      dialog={currentDialog}
      interactionName={interactionName}
      interactionType={interactionType}
      chapterTitle={chapterTitle}
      episodeTitle={episodeTitle}
      onOptionSelect={advance}
      history={history}
      skillDice={skillDice}
      onSkillSuccess={recordSkillSuccess}
    />
  );
}
