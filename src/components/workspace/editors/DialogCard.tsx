import { useState } from "react";
import { cn } from "@/lib/utils";
import { MessageSquare, ChevronDown, ChevronUp } from "lucide-react";

interface DialogCardProps {
  index: number;
  text: string;
  optionCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function DialogCard({ index, text, optionCount, isSelected, onClick }: DialogCardProps) {
  const [expanded, setExpanded] = useState(false);

  const hasMore = text.length > 0;

  return (
    <div
      className={cn(
        "w-64 rounded border cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-muted/20 hover:border-primary/40"
      )}
      onClick={onClick}
    >
      <div className="p-3">
        <div className="flex items-start gap-2">
          <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground mb-1">Dialog {index + 1}</p>
            <p className="text-xs text-muted-foreground mt-1">{optionCount} option{optionCount !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {expanded ? (
          <div
            className="mt-2 h-36 overflow-y-auto text-sm leading-relaxed whitespace-pre-wrap pr-1"
            onClick={(e) => e.stopPropagation()}
          >
            {text || "(empty)"}
          </div>
        ) : (
          <p className="mt-2 text-sm truncate">{text || "(empty)"}</p>
        )}
      </div>

      {hasMore && (
        <button
          className="w-full flex items-center justify-center gap-1 py-1 border-t border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors"
          onClick={(e) => { e.stopPropagation(); setExpanded((v) => !v); }}
        >
          {expanded ? <><ChevronUp className="h-3 w-3" /> Collapse</> : <><ChevronDown className="h-3 w-3" /> Expand</>}
        </button>
      )}
    </div>
  );
}
