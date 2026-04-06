import { useParams, useNavigate } from "react-router";
import AppShell from "@/components/layout/AppShell";
import PlayView from "@/components/play/PlayView";
import { useTale } from "@/hooks/useTale";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function PlayPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tale } = useTale(id!);

  if (!tale) {
    return (
      <AppShell fullScreen>
        <div className="flex items-center justify-center h-full">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell fullScreen>
      <div className="flex flex-col h-full">
        {/* Minimal top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/30">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5 text-muted-foreground hover:text-foreground"
            onClick={() => navigate(`/tale/${id}`)}
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Editor
          </Button>
          <h1 className="font-heading text-primary text-lg">{tale.title}</h1>
          <div className="w-[120px]" /> {/* Spacer for centering */}
        </div>

        {/* Play area */}
        <div className="flex-1 overflow-y-auto py-8">
          <div className="flex min-h-full items-center justify-center">
            <PlayView tale={tale} onBackToEditor={() => navigate(`/tale/${id}`)} />
          </div>
        </div>
      </div>
    </AppShell>
  );
}
