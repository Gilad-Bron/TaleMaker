import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { Tale } from "@/types/tale";
import { createChapter } from "@/lib/factory";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface TaleEditorProps {
  tale: Tale;
  updateTale: (updater: (t: Tale) => Tale) => void;
}

export default function TaleEditor({ tale, updateTale }: TaleEditorProps) {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-3xl font-heading text-primary mb-4">Tale Settings</h2>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Title</label>
        <Input
          value={tale.title}
          onChange={(e) => updateTale((t) => ({ ...t, title: e.target.value }))}
          className="bg-background border-border text-lg font-heading"
          placeholder="Enter tale title..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Description</label>
        <Textarea
          value={tale.description}
          onChange={(e) => updateTale((t) => ({ ...t, description: e.target.value }))}
          className="bg-background border-border resize-none"
          placeholder="Describe your tale..."
          rows={4}
        />
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading text-primary">Chapters ({tale.chapters.length})</h3>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={() => updateTale((t) => ({ ...t, chapters: [...t.chapters, createChapter()] }))}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Chapter
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">Select a chapter in the sidebar to edit it.</p>
      </div>
    </div>
  );
}
