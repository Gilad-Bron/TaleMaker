import { useState, ReactNode } from "react";
import { ChevronRight, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface TreeNodeProps {
  label: string;
  icon?: ReactNode;
  isSelected: boolean;
  depth: number;
  onClick: () => void;
  children?: ReactNode;
  hasChildren?: boolean;
  dimmed?: boolean;
  isPicker?: boolean;
}

export default function TreeNode({ label, icon, isSelected, depth, onClick, children, hasChildren, dimmed, isPicker }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center gap-1.5 py-[5px] pr-3 text-xs text-left transition-all relative",
          isPicker
            ? "text-primary hover:bg-primary/10 cursor-crosshair"
            : dimmed
              ? "text-muted-foreground/30 cursor-default"
              : "hover:text-foreground hover:bg-white/[0.03]",
          isSelected && !dimmed && !isPicker
            ? "text-primary bg-primary/8"
            : !isPicker && !dimmed
              ? "text-muted-foreground/80"
              : ""
        )}
        style={{
          paddingLeft: `${depth * 14 + 10}px`,
          fontFamily: "var(--font-body)",
          fontSize: "0.8rem",
        }}
        onClick={onClick}
      >
        {/* Selected indicator */}
        {isSelected && !dimmed && !isPicker && (
          <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary" />
        )}

        {/* Picker indicator */}
        {isPicker && (
          <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-primary/40" />
        )}

        {hasChildren ? (
          <span
            className="shrink-0 cursor-pointer text-muted-foreground/50 hover:text-muted-foreground"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded
              ? <ChevronDown className="h-3 w-3" />
              : <ChevronRight className="h-3 w-3" />
            }
          </span>
        ) : (
          <span className="w-3 shrink-0" />
        )}

        {icon && <span className="shrink-0 opacity-70">{icon}</span>}
        <span className="truncate">{label}</span>

        {isPicker && (
          <span className="ml-auto shrink-0 text-primary/50 text-[10px]">←</span>
        )}
      </button>
      {hasChildren && expanded && (
        <div className="relative">
          {depth < 3 && (
            <span
              className="absolute top-0 bottom-0 border-l border-border/30"
              style={{ left: `${depth * 14 + 17}px` }}
            />
          )}
          {children}
        </div>
      )}
    </div>
  );
}
