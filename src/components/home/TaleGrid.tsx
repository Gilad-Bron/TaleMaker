import TaleCard from "./TaleCard";
import type { Tale } from "@/types/tale";
import { BookOpen } from "lucide-react";

type TaleSummary = Pick<Tale, "id" | "title" | "description" | "updatedAt">;

interface TaleGridProps {
  tales: TaleSummary[];
  onDelete: (id: string) => void;
}

export default function TaleGrid({ tales, onDelete }: TaleGridProps) {
  if (tales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-muted-foreground">
        <BookOpen className="h-16 w-16 mb-4 opacity-30" />
        <p className="text-lg">No tales yet</p>
        <p className="text-sm">Create your first tale to begin your adventure.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {tales.map((tale) => (
        <TaleCard key={tale.id} {...tale} onDelete={onDelete} />
      ))}
    </div>
  );
}
