import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, MapPin, ArrowLeft, ArrowRight, ScrollText, Dices } from "lucide-react";
import type { Dialog } from "@/types/tale";
import type { HistoryEntry } from "@/hooks/usePlayState";
import SkillCheckRoll from "./SkillCheckRoll";

interface DialogDisplayProps {
  dialog: Dialog;
  interactionName: string;
  interactionType: "character" | "area";
  chapterTitle: string;
  episodeTitle: string;
  onOptionSelect: (choiceLabel: string, targetDialogId?: string) => void;
  history: HistoryEntry[];
  skillDice: Record<string, number>;
  onSkillSuccess: (skill: string) => void;
}

export default function DialogDisplay({
  dialog,
  interactionName,
  interactionType,
  chapterTitle,
  episodeTitle,
  onOptionSelect,
  history,
  skillDice,
  onSkillSuccess,
}: DialogDisplayProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [textKey, setTextKey] = useState(0);
  const [rollingId, setRollingId] = useState<string | null>(null);
  const [failedOptions, setFailedOptions] = useState<Map<string, number>>(new Map());

  // Reset roll state when dialog changes
  useEffect(() => {
    setRollingId(null);
    setFailedOptions(new Map());
  }, [dialog.id]);

  useEffect(() => {
    setHistoryIndex(history.length - 1);
    setTextKey((k) => k + 1);
  }, [history.length]);

  const entry = history[historyIndex] ?? null;
  const anyRolling = rollingId !== null;

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-10">
      {/* Context */}
      <div className="flex items-center gap-2 mb-6 text-xs text-muted-foreground/40">
        <span>{chapterTitle}</span>
        <span>·</span>
        <span>{episodeTitle}</span>
      </div>

      {/* Speaker */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {interactionType === "character"
            ? <User className="h-3.5 w-3.5 text-muted-foreground/50" />
            : <MapPin className="h-3.5 w-3.5 text-muted-foreground/50" />
          }
          <span className="text-base text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            {interactionName}
          </span>
        </div>
        {history.length > 0 && (
          <button
            className="text-xs text-muted-foreground/40 hover:text-muted-foreground transition-colors flex items-center gap-1"
            onClick={() => setShowHistory((v) => !v)}
          >
            <ScrollText className="h-3 w-3" />
            {showHistory ? "Hide" : "Log"}
          </button>
        )}
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="mb-5 p-4 border border-border/40 bg-card/30 text-sm" style={{ borderRadius: "2px" }}>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs text-muted-foreground/40">{historyIndex + 1} / {history.length}</span>
            <div className="flex gap-0.5">
              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground/40" disabled={historyIndex <= 0} onClick={() => setHistoryIndex((i) => i - 1)}>
                <ArrowLeft className="h-3 w-3" />
              </Button>
              <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground/40" disabled={historyIndex >= history.length - 1} onClick={() => setHistoryIndex((i) => i + 1)}>
                <ArrowRight className="h-3 w-3" />
              </Button>
            </div>
          </div>
          <p className="leading-relaxed italic text-foreground/60 whitespace-pre-wrap">{entry?.text}</p>
          {entry && (
            <p className="mt-3 text-xs text-muted-foreground/40">→ {entry.choiceLabel}</p>
          )}
        </div>
      )}

      {/* Dialog text */}
      <div key={textKey} className="mb-6 animate-fade-up">
        <p className="text-base leading-[1.9] whitespace-pre-wrap italic text-foreground/85">
          {dialog.text || "(empty dialog)"}
        </p>
      </div>

      <div className="h-px bg-border/30 mb-6" />

      {/* Options */}
      <div className="space-y-2">
        {dialog.options.map((option) => {
          const sc = option.skillCheck;
          const failed = failedOptions.has(option.id);
          const rolling = rollingId === option.id;
          const dimmed = anyRolling && !rolling;

          return (
            <div key={option.id}>
              <button
                disabled={failed || dimmed}
                className={[
                  "w-full flex items-center justify-between gap-3 px-4 py-3 text-left border transition-all text-sm",
                  failed
                    ? "border-destructive/15 text-foreground/20 cursor-not-allowed"
                    : rolling
                    ? "border-primary/30 bg-card/20 text-foreground/90"
                    : dimmed
                    ? "border-border/20 text-foreground/20"
                    : "border-border/40 bg-card/10 hover:bg-card/40 hover:border-border/70 text-foreground/70 hover:text-foreground",
                ].join(" ")}
                style={{ borderRadius: rolling ? "2px 2px 0 0" : "2px" }}
                onClick={() => {
                  if (failed || anyRolling) return;
                  if (sc) {
                    setRollingId(option.id);
                  } else {
                    onOptionSelect(option.label || "", option.targetDialogId);
                  }
                }}
              >
                <span className="flex items-center gap-2.5">
                  {sc && (
                    <Dices className={`h-3 w-3 shrink-0 ${
                      failed ? "text-destructive/30"
                      : rolling ? "text-primary/70"
                      : "text-primary/35"
                    }`} />
                  )}
                  <span>{option.label || "(unnamed option)"}</span>
                </span>

                {sc && (
                  <span
                    className="text-xs tabular-nums shrink-0 ml-2"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {failed ? (
                      <span className="text-destructive/40">✗ {failedOptions.get(option.id)}</span>
                    ) : (
                      <span className="text-muted-foreground/30">{sc.skill} DC {sc.dc}</span>
                    )}
                  </span>
                )}
              </button>

              {rolling && sc && (
                <div
                  className="border border-t-0 border-primary/20 bg-card/30"
                  style={{ borderRadius: "0 0 2px 2px" }}
                >
                  <SkillCheckRoll
                    skill={sc.skill}
                    dc={sc.dc}
                    dieFaces={skillDice[sc.skill] ?? 20}
                    description={sc.description}
                    onComplete={({ success, roll }) => {
                      setRollingId(null);
                      if (success) {
                        onSkillSuccess(sc.skill);
                        onOptionSelect(option.label || "", option.targetDialogId);
                      } else {
                        setFailedOptions((prev) => new Map(prev).set(option.id, roll));
                      }
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
