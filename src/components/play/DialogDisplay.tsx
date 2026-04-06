import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { User, MapPin, ArrowLeft, ArrowRight } from "lucide-react";
import type { Dialog } from "@/types/tale";
import type { HistoryEntry } from "@/hooks/usePlayState";

interface DialogDisplayProps {
  dialog: Dialog;
  interactionName: string;
  interactionType: "character" | "area";
  chapterTitle: string;
  episodeTitle: string;
  onOptionSelect: (choiceLabel: string) => void;
  history: HistoryEntry[];
}

export default function DialogDisplay({
  dialog,
  interactionName,
  interactionType,
  chapterTitle,
  episodeTitle,
  onOptionSelect,
  history,
}: DialogDisplayProps) {
  const [showHistory, setShowHistory] = useState(false);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Keep historyIndex pointing at the latest entry when new entries arrive
  useEffect(() => {
    setHistoryIndex(history.length - 1);
  }, [history.length]);

  const entry = history[historyIndex] ?? null;

  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* Context header */}
      <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground">
        <span>{chapterTitle}</span>
        <span className="text-border">|</span>
        <span>{episodeTitle}</span>
      </div>

      {/* Interaction name */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {interactionType === "character" ? (
            <User className="h-5 w-5 text-accent" />
          ) : (
            <MapPin className="h-5 w-5 text-accent" />
          )}
          <h2 className="text-xl font-heading text-primary">{interactionName}</h2>
        </div>
        {history.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            className="text-muted-foreground border-border/50 hover:text-foreground"
            onClick={() => setShowHistory((v) => !v)}
          >
            {showHistory ? "Hide History" : "History"}
          </Button>
        )}
      </div>

      {/* History panel */}
      {showHistory && (
        <div className="mt-8 mb-6 p-5 rounded-lg border border-border bg-card/30">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground uppercase tracking-wide">
              History — {historyIndex + 1} / {history.length}
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={historyIndex <= 0}
                onClick={() => setHistoryIndex((i) => i - 1)}
              >
                <ArrowLeft className="h-3.5 w-3.5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6"
                disabled={historyIndex >= history.length - 1}
                onClick={() => setHistoryIndex((i) => i + 1)}
              >
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
          <p className="text-base leading-relaxed whitespace-pre-wrap text-foreground/80">
            {entry?.text}
          </p>
          {entry && (
            <div className="mt-4 pt-4 border-t border-border/50">
              <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Choice made</p>
              <p className="text-sm text-primary">{entry.choiceLabel}</p>
            </div>
          )}
        </div>
      )}

      {/* Dialog text */}
      <div className="mb-8 p-6 rounded-lg border border-border/50 bg-card/50">
        <p className="text-lg leading-relaxed whitespace-pre-wrap">
          {dialog.text || "(empty dialog)"}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {dialog.options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            className="w-full justify-start text-left py-4 px-6 h-auto border-primary/30 text-foreground hover:bg-primary/10 hover:border-primary/60 hover:text-primary transition-all"
            onClick={() => onOptionSelect(option.label || "")}
          >
            {option.label || "(unnamed option)"}
          </Button>
        ))}
      </div>

    </div>
  );
}
