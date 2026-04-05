import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import type { Tale, SelectedNode } from "@/types/tale";
import { createEpisode } from "@/lib/factory";

interface ChapterEditorProps {
  tale: Tale;
  chapterIndex: number;
  updateTale: (updater: (t: Tale) => Tale) => void;
  onSelect: (node: SelectedNode) => void;
}

export default function ChapterEditor({ tale, chapterIndex, updateTale, onSelect }: ChapterEditorProps) {
  const chapter = tale.chapters[chapterIndex];

  const updateChapter = (field: string, value: string) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, i) => (i === chapterIndex ? { ...ch, [field]: value } : ch)),
    }));
  };

  const addEpisode = () => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, episodes: [...ch.episodes, createEpisode()] } : ch
      ),
    }));
  };

  const removeEpisode = (episodeIndex: number) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, i) =>
        i === chapterIndex ? { ...ch, episodes: ch.episodes.filter((_, ei) => ei !== episodeIndex) } : ch
      ),
    }));
  };

  const moveEpisode = (from: number, direction: -1 | 1) => {
    const to = from + direction;
    if (to < 0 || to >= chapter.episodes.length) return;
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, i) => {
        if (i !== chapterIndex) return ch;
        const eps = [...ch.episodes];
        [eps[from], eps[to]] = [eps[to], eps[from]];
        return { ...ch, episodes: eps };
      }),
    }));
  };

  const deleteChapter = () => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.filter((_, i) => i !== chapterIndex),
    }));
    onSelect({ type: "tale" });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-heading text-primary">Chapter</h2>
        <Button variant="destructive" size="sm" className="gap-1.5" onClick={deleteChapter}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete Chapter
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Title</label>
        <Input
          value={chapter.title}
          onChange={(e) => updateChapter("title", e.target.value)}
          className="bg-background border-border"
          placeholder="Chapter title..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Description</label>
        <Textarea
          value={chapter.description}
          onChange={(e) => updateChapter("description", e.target.value)}
          className="bg-background border-border resize-none"
          placeholder="Chapter description..."
          rows={3}
        />
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading text-primary">Episodes ({chapter.episodes.length})</h3>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={addEpisode}>
            <Plus className="h-3.5 w-3.5" />
            Add Episode
          </Button>
        </div>
        <div className="space-y-2">
          {chapter.episodes.map((episode, ei) => (
            <div
              key={episode.id}
              className="flex items-center gap-2 p-3 rounded bg-muted/30 border border-border hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => onSelect({ type: "episode", chapterIndex, episodeIndex: ei })}
            >
              <span className="text-xs text-muted-foreground w-6">{ei + 1}.</span>
              <span className="flex-1 truncate">{episode.title || "Untitled Episode"}</span>
              <span className="text-xs text-muted-foreground">{episode.interactions.length} interactions</span>
              <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveEpisode(ei, -1)} disabled={ei === 0}>
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveEpisode(ei, 1)} disabled={ei === chapter.episodes.length - 1}>
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeEpisode(ei)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {chapter.episodes.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No episodes yet. Add one to get started.</p>
          )}
        </div>
      </div>
    </div>
  );
}
