import TaleCard from "./TaleCard";
import type { Tale } from "@/types/tale";

type TaleSummary = Pick<Tale, "id" | "title" | "description" | "updatedAt">;

interface TaleGridProps {
  tales: TaleSummary[];
  onDelete: (id: string) => void;
}

export default function TaleGrid({ tales, onDelete }: TaleGridProps) {
  if (tales.length === 0) {
    return (
      <div className="py-24 text-center text-muted-foreground/40 text-sm italic">
        No tales yet.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
      {tales.map((tale) => (
        <TaleCard key={tale.id} {...tale} onDelete={onDelete} />
      ))}
    </div>
  );
}
