import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PlayCompleteProps {
  taleTitle: string;
  onBackToEditor: () => void;
}

export default function PlayComplete({ taleTitle, onBackToEditor }: PlayCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8 min-h-[70vh] gap-4">
      <h1 className="text-4xl text-primary" style={{ fontFamily: "var(--font-heading)" }}>
        The End
      </h1>
      <p className="text-muted-foreground text-sm italic">{taleTitle}</p>
      <Button
        variant="ghost"
        className="mt-4 gap-2 text-muted-foreground hover:text-foreground"
        style={{ borderRadius: "2px" }}
        onClick={onBackToEditor}
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back to editor
      </Button>
    </div>
  );
}
