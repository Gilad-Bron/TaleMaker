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
}

export default function TreeNode({ label, icon, isSelected, depth, onClick, children, hasChildren }: TreeNodeProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div>
      <button
        className={cn(
          "w-full flex items-center gap-1.5 py-1 px-2 text-sm text-left rounded hover:bg-muted/50 transition-colors",
          isSelected && "bg-muted text-primary"
        )}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={onClick}
      >
        {hasChildren ? (
          <span
            className="shrink-0 cursor-pointer"
            onClick={(e) => { e.stopPropagation(); setExpanded(!expanded); }}
          >
            {expanded ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
          </span>
        ) : (
          <span className="w-3.5 shrink-0" />
        )}
        {icon && <span className="shrink-0">{icon}</span>}
        <span className="truncate">{label}</span>
      </button>
      {hasChildren && expanded && <div>{children}</div>}
    </div>
  );
}
