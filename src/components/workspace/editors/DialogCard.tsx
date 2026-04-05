import { cn } from "@/lib/utils";
import { MessageSquare } from "lucide-react";

interface DialogCardProps {
  index: number;
  text: string;
  optionCount: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function DialogCard({ index, text, optionCount, isSelected, onClick }: DialogCardProps) {
  return (
    <div
      className={cn(
        "p-3 rounded border cursor-pointer transition-all",
        isSelected
          ? "border-primary bg-primary/10"
          : "border-border bg-muted/20 hover:border-primary/40"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-2">
        <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-xs text-muted-foreground mb-1">Dialog {index + 1}</p>
          <p className="text-sm truncate">{text || "(empty)"}</p>
          <p className="text-xs text-muted-foreground mt-1">{optionCount} option{optionCount !== 1 ? "s" : ""}</p>
        </div>
      </div>
    </div>
  );
}
