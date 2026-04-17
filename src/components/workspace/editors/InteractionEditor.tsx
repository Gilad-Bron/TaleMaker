import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, User, MapPin, ArrowDown } from "lucide-react";
import type { Tale, SelectedNode } from "@/types/tale";
import { createDialog } from "@/lib/factory";
import DialogCard from "./DialogCard";

interface InteractionEditorProps {
  tale: Tale;
  chapterIndex: number;
  episodeIndex: number;
  interactionIndex: number;
  updateTale: (updater: (t: Tale) => Tale) => void;
  onSelect: (node: SelectedNode) => void;
}

export default function InteractionEditor({
  tale, chapterIndex, episodeIndex, interactionIndex, updateTale, onSelect,
}: InteractionEditorProps) {
  const interaction = tale.chapters[chapterIndex].episodes[episodeIndex].interactions[interactionIndex];
  const [selectedDialogIndex, setSelectedDialogIndex] = useState<number | null>(null);

  const updateInteraction = (field: string, value: string) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : {
              ...ep,
              interactions: ep.interactions.map((int, ii) =>
                ii !== interactionIndex ? int : { ...int, [field]: value }
              ),
            }
          ),
        }
      ),
    }));
  };

  const toggleType = () => {
    const newType = interaction.type === "character" ? "area" : "character";
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : {
              ...ep,
              interactions: ep.interactions.map((int, ii) =>
                ii !== interactionIndex ? int : { ...int, type: newType }
              ),
            }
          ),
        }
      ),
    }));
  };

  const addDialog = () => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : {
              ...ep,
              interactions: ep.interactions.map((int, ii) =>
                ii !== interactionIndex ? int : { ...int, dialogs: [...int.dialogs, createDialog()] }
              ),
            }
          ),
        }
      ),
    }));
  };

  const removeDialog = (di: number) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : {
              ...ep,
              interactions: ep.interactions.map((int, ii) =>
                ii !== interactionIndex ? int : { ...int, dialogs: int.dialogs.filter((_, i) => i !== di) }
              ),
            }
          ),
        }
      ),
    }));
    if (selectedDialogIndex === di) setSelectedDialogIndex(null);
  };

  const deleteInteraction = () => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : {
              ...ep,
              interactions: ep.interactions.filter((_, ii) => ii !== interactionIndex),
            }
          ),
        }
      ),
    }));
    onSelect({ type: "episode", chapterIndex, episodeIndex });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-heading text-primary">Interaction</h2>
        <Button variant="destructive" size="sm" className="gap-1.5" onClick={deleteInteraction}>
          <Trash2 className="h-3.5 w-3.5" />
          Delete
        </Button>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex-1 space-y-2">
          <label className="text-sm text-muted-foreground">Name</label>
          <Input
            value={interaction.name}
            onChange={(e) => updateInteraction("name", e.target.value)}
            className="bg-background border-border"
            placeholder={interaction.type === "character" ? "Character name..." : "Area name..."}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Type</label>
          <Button variant="outline" className="gap-1.5" onClick={toggleType}>
            {interaction.type === "character" ? (
              <><User className="h-4 w-4" /> Character</>
            ) : (
              <><MapPin className="h-4 w-4" /> Area</>
            )}
          </Button>
        </div>
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading text-primary">Dialog Chain</h3>
          <Button size="sm" variant="outline" className="gap-1.5" onClick={addDialog}>
            <Plus className="h-3.5 w-3.5" />
            Add Dialog
          </Button>
        </div>

        <div className="flex flex-col gap-2">
          {interaction.dialogs.map((dialog, di) => (
            <div key={dialog.id} className="flex flex-col items-start gap-2">
              <div className="relative">
                <DialogCard
                  index={di}
                  text={dialog.text}
                  optionCount={dialog.options.length}
                  isSelected={selectedDialogIndex === di}
                  onClick={() => {
                    setSelectedDialogIndex(di);
                    onSelect({
                      type: "dialog",
                      chapterIndex,
                      episodeIndex,
                      interactionIndex,
                      dialogIndex: di,
                    });
                  }}
                />
                {interaction.dialogs.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/80"
                    onClick={(e) => { e.stopPropagation(); removeDialog(di); }}
                  >
                    <Trash2 className="h-2.5 w-2.5" />
                  </Button>
                )}
              </div>
              {di < interaction.dialogs.length - 1 && (
                <ArrowDown className="h-4 w-4 text-muted-foreground ml-4" />
              )}
            </div>
          ))}
        </div>

        {interaction.dialogs.length === 0 && (
          <p className="text-sm text-muted-foreground py-4 text-center">No dialogs. Add one to start building the conversation.</p>
        )}

        <div className="mt-2 flex gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs">
            {interaction.dialogs.length} dialog{interaction.dialogs.length !== 1 ? "s" : ""} in chain
          </Badge>
          <Badge variant="outline" className="text-xs text-muted-foreground">
            Linear flow: options advance to next dialog
          </Badge>
        </div>
      </div>
    </div>
  );
}
