import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical, Trash2, Play, Pencil } from "lucide-react";

interface TaleCardProps {
  id: string;
  title: string;
  description: string;
  updatedAt: string;
  onDelete: (id: string) => void;
}

export default function TaleCard({ id, title, description, updatedAt, onDelete }: TaleCardProps) {
  const navigate = useNavigate();

  const formattedDate = new Date(updatedAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      className="tale-card group relative bg-card border border-border/60 cursor-pointer flex flex-col"
      style={{ borderRadius: "2px" }}
      onClick={() => navigate(`/tale/${id}`)}
    >
      <div className="flex-1 p-4 pb-3">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2
            className="text-base text-primary leading-tight"
            style={{ fontFamily: "var(--font-heading)" }}
          >
            {title}
          </h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-foreground hover:bg-white/5"
              >
                <MoreVertical className="h-3.5 w-3.5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border/80 text-sm" style={{ borderRadius: "2px" }}>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/tale/${id}`); }}>
                <Pencil className="h-3.5 w-3.5 text-muted-foreground" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer" onClick={(e) => { e.stopPropagation(); navigate(`/tale/${id}/play`); }}>
                <Play className="h-3.5 w-3.5 text-muted-foreground" /> Play
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive cursor-pointer" onClick={(e) => { e.stopPropagation(); onDelete(id); }}>
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-muted-foreground italic leading-relaxed line-clamp-2">
          {description || "No description."}
        </p>
      </div>

      <div className="px-4 py-2 border-t border-border/30">
        <span className="text-xs text-muted-foreground/40">{formattedDate}</span>
      </div>
    </div>
  );
}
