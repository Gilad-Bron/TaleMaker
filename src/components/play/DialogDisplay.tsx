import { Button } from "@/components/ui/button";
import { User, MapPin } from "lucide-react";
import type { Dialog } from "@/types/tale";

interface DialogDisplayProps {
  dialog: Dialog;
  interactionName: string;
  interactionType: "character" | "area";
  chapterTitle: string;
  episodeTitle: string;
  onOptionSelect: () => void;
}

export default function DialogDisplay({
  dialog,
  interactionName,
  interactionType,
  chapterTitle,
  episodeTitle,
  onOptionSelect,
}: DialogDisplayProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-6">
      {/* Context header */}
      <div className="flex items-center gap-3 mb-6 text-sm text-muted-foreground">
        <span>{chapterTitle}</span>
        <span className="text-border">|</span>
        <span>{episodeTitle}</span>
      </div>

      {/* Interaction name */}
      <div className="flex items-center gap-2 mb-4">
        {interactionType === "character" ? (
          <User className="h-5 w-5 text-accent" />
        ) : (
          <MapPin className="h-5 w-5 text-accent" />
        )}
        <h2 className="text-xl font-heading text-primary">{interactionName}</h2>
      </div>

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
            onClick={onOptionSelect}
          >
            {option.label || "(unnamed option)"}
          </Button>
        ))}
      </div>
    </div>
  );
}
