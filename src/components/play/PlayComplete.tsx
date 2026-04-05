import { Button } from "@/components/ui/button";
import { BookOpen, ArrowLeft } from "lucide-react";

interface PlayCompleteProps {
  taleTitle: string;
  onBackToEditor: () => void;
}

export default function PlayComplete({ taleTitle, onBackToEditor }: PlayCompleteProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center px-8">
      <BookOpen className="h-16 w-16 text-primary mb-6 opacity-60" />
      <h1 className="text-4xl font-heading text-primary mb-2">The End</h1>
      <p className="text-lg text-muted-foreground mb-8">
        You have completed <span className="text-foreground font-medium">{taleTitle}</span>.
      </p>
      <Button className="gap-2" onClick={onBackToEditor}>
        <ArrowLeft className="h-4 w-4" />
        Back to Editor
      </Button>
    </div>
  );
}
