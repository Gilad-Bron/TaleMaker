import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ArrowUp, ArrowDown, User, MapPin } from "lucide-react";
import type { Tale, SelectedNode } from "@/types/tale";
import { createInteraction } from "@/lib/factory";

interface EpisodeEditorProps {
  tale: Tale;
  chapterIndex: number;
  episodeIndex: number;
  updateTale: (updater: (t: Tale) => Tale) => void;
  onSelect: (node: SelectedNode) => void;
}

export default function EpisodeEditor({ tale, chapterIndex, episodeIndex, updateTale, onSelect }: EpisodeEditorProps) {
  const episode = tale.chapters[chapterIndex].episodes[episodeIndex];

  const updateEpisode = (field: string, value: string) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) => (ei === episodeIndex ? { ...ep, [field]: value } : ep)),
        }
      ),
    }));
  };

  const addInteraction = (type: "character" | "area") => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : { ...ep, interactions: [...ep.interactions, createInteraction(type)] }
          ),
        }
      ),
    }));
  };

  const removeInteraction = (ii: number) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : { ...ep, interactions: ep.interactions.filter((_, i) => i !== ii) }
          ),
        }
      ),
    }));
  };

  const moveInteraction = (from: number, direction: -1 | 1) => {
    const to = from + direction;
    if (to < 0 || to >= episode.interactions.length) return;
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) => {
            if (ei !== episodeIndex) return ep;
            const ints = [...ep.interactions];
            [ints[from], ints[to]] = [ints[to], ints[from]];
            return { ...ep, interactions: ints };
          }),
        }
      ),
    }));
  };

  const deleteEpisode = () => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.filter((_, ei) => ei !== episodeIndex),
        }
      ),
    }));
    onSelect({ type: "chapter", chapterIndex });
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading text-primary">Episode</h2>
        <Button variant="destructive" size="sm" className="gap-1.5" onClick={deleteEpisode}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete Episode
        </Button>
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Title</label>
        <Input
          value={episode.title}
          onChange={(e) => updateEpisode("title", e.target.value)}
          className="bg-background border-border"
          placeholder="Episode title..."
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Description</label>
        <Textarea
          value={episode.description}
          onChange={(e) => updateEpisode("description", e.target.value)}
          className="bg-background border-border resize-none"
          placeholder="Episode description..."
          rows={3}
        />
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-heading text-primary">Interactions ({episode.interactions.length})</h3>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => addInteraction("character")}>
              <User className="h-3.5 w-3.5" />
              Character
            </Button>
            <Button size="sm" variant="outline" className="gap-1.5" onClick={() => addInteraction("area")}>
              <MapPin className="h-3.5 w-3.5" />
              Area
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          {episode.interactions.map((interaction, ii) => (
            <div
              key={interaction.id}
              className="flex items-center gap-2 p-3 bg-muted/30 border border-border hover:border-primary/30 transition-colors cursor-pointer"
              onClick={() => onSelect({ type: "interaction", chapterIndex, episodeIndex, interactionIndex: ii })}
            >
              {interaction.type === "character" ? (
                <User className="h-4 w-4 text-accent shrink-0" />
              ) : (
                <MapPin className="h-4 w-4 text-accent shrink-0" />
              )}
              <span className="flex-1 truncate">{interaction.name || "Untitled"}</span>
              <span className="text-xs text-muted-foreground">{interaction.dialogs.length} dialogs</span>
              <div className="flex gap-0.5" onClick={(e) => e.stopPropagation()}>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveInteraction(ii, -1)} disabled={ii === 0}>
                  <ArrowUp className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveInteraction(ii, 1)} disabled={ii === episode.interactions.length - 1}>
                  <ArrowDown className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => removeInteraction(ii)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </div>
          ))}
          {episode.interactions.length === 0 && (
            <p className="text-sm text-muted-foreground py-4 text-center">No interactions yet. Add a character or area interaction.</p>
          )}
        </div>
      </div>
    </div>
  );
}
