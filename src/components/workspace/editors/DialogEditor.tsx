import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { Plus, Trash2 } from "lucide-react";
import type { Tale } from "@/types/tale";
import { createOption } from "@/lib/factory";

interface DialogEditorProps {
  tale: Tale;
  chapterIndex: number;
  episodeIndex: number;
  interactionIndex: number;
  dialogIndex: number;
  updateTale: (updater: (t: Tale) => Tale) => void;
}

export default function DialogEditor({
  tale, chapterIndex, episodeIndex, interactionIndex, dialogIndex, updateTale,
}: DialogEditorProps) {
  const dialog = tale.chapters[chapterIndex].episodes[episodeIndex].interactions[interactionIndex].dialogs[dialogIndex];
  const dialogs = tale.chapters[chapterIndex].episodes[episodeIndex].interactions[interactionIndex].dialogs;
  const isLastDialog = dialogIndex === dialogs.length - 1;
  const nextDialogText = !isLastDialog ? dialogs[dialogIndex + 1].text : null;

  const updateDialog = (updater: (d: typeof dialog) => typeof dialog) => {
    updateTale((t) => ({
      ...t,
      chapters: t.chapters.map((ch, ci) =>
        ci !== chapterIndex ? ch : {
          ...ch,
          episodes: ch.episodes.map((ep, ei) =>
            ei !== episodeIndex ? ep : {
              ...ep,
              interactions: ep.interactions.map((int, ii) =>
                ii !== interactionIndex ? int : {
                  ...int,
                  dialogs: int.dialogs.map((dlg, di) =>
                    di !== dialogIndex ? dlg : updater(dlg)
                  ),
                }
              ),
            }
          ),
        }
      ),
    }));
  };

  const updateText = (text: string) => {
    updateDialog((d) => ({ ...d, text }));
  };

  const updateOptionLabel = (optionIndex: number, label: string) => {
    updateDialog((d) => ({
      ...d,
      options: d.options.map((opt, i) => (i === optionIndex ? { ...opt, label } : opt)),
    }));
  };

  const addOption = () => {
    if (dialog.options.length >= 5) return;
    updateDialog((d) => ({ ...d, options: [...d.options, createOption("Option " + (d.options.length + 1))] }));
  };

  const removeOption = (optionIndex: number) => {
    if (dialog.options.length <= 1) return;
    updateDialog((d) => ({ ...d, options: d.options.filter((_, i) => i !== optionIndex) }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-3xl font-heading text-primary">Dialog {dialogIndex + 1}</h2>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Text</label>
        <Textarea
          value={dialog.text}
          onChange={(e) => updateText(e.target.value)}
          className="bg-background border-border resize-none min-h-[120px]"
          placeholder="Write the dialog text that the player will see..."
          rows={5}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-lg font-heading text-primary">Options</h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {isLastDialog
                ? "This is the last dialog — options will end the interaction."
                : "All options advance to the next dialog in the chain."}
            </p>
          </div>
          <Button
            size="sm"
            variant="outline"
            className="gap-1.5"
            onClick={addOption}
            disabled={dialog.options.length >= 5}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Option ({dialog.options.length}/5)
          </Button>
        </div>

        <div className="space-y-2">
          {dialog.options.map((option, oi) => (
            <div key={option.id} className="flex items-center gap-2">
              <span className="text-xs text-muted-foreground w-6 shrink-0">{oi + 1}.</span>
              <Input
                value={option.label}
                onChange={(e) => updateOptionLabel(oi, e.target.value)}
                className="bg-background border-border flex-1"
                placeholder="Option label..."
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive shrink-0"
                onClick={() => removeOption(oi)}
                disabled={dialog.options.length <= 1}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="pt-4 border-t border-border">
        <h3 className="text-lg font-heading text-primary mb-3">Preview</h3>
        <div className="p-6 rounded-lg bg-background border border-border">
          <p className="text-base leading-relaxed mb-4 whitespace-pre-wrap">
            {dialog.text || "(no text yet)"}
          </p>
          <div className="space-y-2">
            {dialog.options.map((option, oi) => (
              <Tooltip key={option.id}>
                <TooltipTrigger asChild>
                  <div className="px-4 py-2 rounded border border-primary/30 text-primary text-sm hover:bg-primary/10 transition-colors cursor-default">
                    {option.label || `(option ${oi + 1})`}
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-xs p-3 text-xs leading-relaxed whitespace-pre-wrap">
                  {nextDialogText ?? "(end of interaction)"}
                </TooltipContent>
              </Tooltip>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
