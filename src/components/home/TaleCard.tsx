import { useNavigate } from "react-router";
import { Card, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
    <Card
      className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer group"
      onClick={() => navigate(`/tale/${id}`)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <CardTitle className="font-heading text-xl text-primary">{title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-card border-border">
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/tale/${id}`); }}>
                <Pencil className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/tale/${id}/play`); }}>
                <Play className="h-4 w-4 mr-2" />
                Play
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => { e.stopPropagation(); onDelete(id); }}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="text-muted-foreground line-clamp-2">
          {description || "No description"}
        </CardDescription>
      </CardHeader>
      <CardFooter className="pt-2">
        <span className="text-xs text-muted-foreground">Last edited {formattedDate}</span>
      </CardFooter>
    </Card>
  );
}
