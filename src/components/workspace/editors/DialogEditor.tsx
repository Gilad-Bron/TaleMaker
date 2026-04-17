import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, Trash2, ChevronDown, ArrowRight, Link2, Crosshair, X, CornerUpLeft, Dices } from "lucide-react";
import type { Tale, SelectedNode, SkillCheck } from "@/types/tale";
import { createOption, createDialog } from "@/lib/factory";

interface DialogEditorProps {
  tale: Tale;
  chapterIndex: number;
  episodeIndex: number;
  interactionIndex: number;
  dialogIndex: number;
  updateTale: (updater: (t: Tale) => Tale) => void;
  onSelect: (node: SelectedNode) => void;
  onActivatePicker: (pickerKey: string, cb: (dialogId: string) => void) => void;
  onDeactivatePicker: () => void;
  pickerOptionIndex: string | null;
}

export default function DialogEditor({
  tale, chapterIndex, episodeIndex, interactionIndex, dialogIndex, updateTale,
  onSelect, onActivatePicker, onDeactivatePicker, pickerOptionIndex,
}: DialogEditorProps) {
  const dialog = tale.chapters[chapterIndex].episodes[episodeIndex].interactions[interactionIndex].dialogs[dialogIndex];

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

  const updateOptionLabel = (oi: number, label: string) => {
    updateDialog((d) => ({
      ...d,
      options: d.options.map((opt, i) => (i === oi ? { ...opt, label } : opt)),
    }));
  };

  const setOptionTarget = (oi: number, targetDialogId: string | undefined) => {
    updateDialog((d) => ({
      ...d,
      options: d.options.map((opt, i) => (i === oi ? { ...opt, targetDialogId } : opt)),
    }));
  };

  const addSkillCheck = (oi: number) => {
    updateDialog((d) => ({
      ...d,
      options: d.options.map((opt, i) =>
        i === oi ? { ...opt, skillCheck: { skill: "", dc: 10 } } : opt
      ),
    }));
  };

  const removeSkillCheck = (oi: number) => {
    updateDialog((d) => ({
      ...d,
      options: d.options.map((opt, i) => {
        if (i !== oi) return opt;
        const { skillCheck: _sc, ...rest } = opt;
        return rest;
      }),
    }));
  };

  const updateSkillCheckField = (oi: number, patch: Partial<SkillCheck>) => {
    updateDialog((d) => ({
      ...d,
      options: d.options.map((opt, i) => {
        if (i !== oi || !opt.skillCheck) return opt;
        return { ...opt, skillCheck: { ...opt.skillCheck, ...patch } };
      }),
    }));
  };

  const createAndLinkDialog = (oi: number) => {
    const newDialog = createDialog();
    const newDialogIndex = tale.chapters[chapterIndex].episodes[episodeIndex].interactions[interactionIndex].dialogs.length;
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
                    di !== dialogIndex
                      ? dlg
                      : { ...dlg, options: dlg.options.map((opt, oii) =>
                          oii !== oi ? opt : { ...opt, targetDialogId: newDialog.id }
                        )}
                  ).concat(newDialog),
                }
              ),
            }
          ),
        }
      ),
    }));
    onSelect({ type: "dialog", chapterIndex, episodeIndex, interactionIndex, dialogIndex: newDialogIndex });
  };

  const addOption = () => {
    if (dialog.options.length >= 5) return;
    updateDialog((d) => ({ ...d, options: [...d.options, createOption("Option " + (d.options.length + 1))] }));
  };

  const removeOption = (oi: number) => {
    if (dialog.options.length <= 1) return;
    updateDialog((d) => ({ ...d, options: d.options.filter((_, i) => i !== oi) }));
  };

  const backCandidates = tale.chapters.flatMap((ch) =>
    ch.episodes.flatMap((ep) =>
      ep.interactions.flatMap((int, ii) =>
        int.dialogs.flatMap((dlg, di) =>
          dlg.options.some((o) => o.targetDialogId === dialog.id) && dlg.id !== dialog.id
            ? [{ id: dlg.id, label: dlg.text ? dlg.text.slice(0, 45) + (dlg.text.length > 45 ? "…" : "") : `Dialog ${di + 1}`, interactionName: int.name || "Untitled" }]
            : []
        )
      )
    )
  );

  const addBackOption = (sourceDialogId: string) => {
    updateDialog((d) => ({
      ...d,
      options: [...d.options, { ...createOption("Back"), targetDialogId: sourceDialogId }],
    }));
  };

  const findDialogLabel = (targetId: string | undefined): string => {
    if (!targetId) return "Next in sequence";
    for (const ch of tale.chapters) {
      for (const ep of ch.episodes) {
        for (const int of ep.interactions) {
          const di = int.dialogs.findIndex((d) => d.id === targetId);
          if (di !== -1) {
            const text = int.dialogs[di].text;
            return text ? text.slice(0, 40) + (text.length > 40 ? "…" : "") : `Dialog ${di + 1}`;
          }
        }
      }
    }
    return "Unknown";
  };

  // Render a target dropdown (reused for regular target, success target, and fail target)
  const renderTargetDropdown = (
    currentTargetId: string | undefined,
    pickerKey: string,
    onSetTarget: (id: string | undefined) => void,
    onCreateAndLink: () => void,
  ) => {
    if (pickerOptionIndex === pickerKey) {
      return (
        <div className="flex items-center gap-2">
          <span
            className="text-xs text-primary animate-pulse"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em" }}
          >
            Click a dialog in the sidebar…
          </span>
          <button
            className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            onClick={onDeactivatePicker}
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      );
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors max-w-xs"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.04em" }}
            disabled={pickerOptionIndex !== null}
          >
            <span className={`truncate ${currentTargetId ? "text-primary/80" : ""}`}>
              {findDialogLabel(currentTargetId)}
            </span>
            <ChevronDown className="h-3 w-3 shrink-0 opacity-60" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-60 bg-card border-border" style={{ borderRadius: "2px" }}>
          <DropdownMenuItem
            className="gap-2 text-primary focus:text-primary focus:bg-primary/10 cursor-pointer"
            onClick={onCreateAndLink}
          >
            <Plus className="h-3.5 w-3.5 shrink-0" />
            <span style={{ fontFamily: "var(--font-display)", letterSpacing: "0.06em", fontSize: "0.75rem" }}>
              New Dialog
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="bg-border/60" />
          <DropdownMenuItem
            className="gap-2 text-muted-foreground focus:text-foreground cursor-pointer"
            onClick={() => onSetTarget(undefined)}
          >
            <ArrowRight className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="text-xs italic">Next in sequence</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="gap-2 text-muted-foreground focus:text-foreground cursor-pointer"
            onClick={() => onActivatePicker(pickerKey, (id) => onSetTarget(id))}
          >
            <Crosshair className="h-3.5 w-3.5 shrink-0 opacity-50" />
            <span className="text-xs">Target Mode</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className="max-w-2xl space-y-6">
      <h2 className="text-lg font-heading text-primary">Dialog {dialogIndex + 1}</h2>

      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Text</label>
        <Textarea
          value={dialog.text}
          onChange={(e) => updateDialog((d) => ({ ...d, text: e.target.value }))}
          className="bg-background border-border resize-none min-h-[120px]"
          placeholder="Write the dialog text that the player will see..."
          rows={5}
        />
      </div>

      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-heading text-primary">Options</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Each option can target any dialog in the tale.</p>
          </div>
          <div className="flex items-center gap-2">
            {backCandidates.length === 1 && (
              <Button
                size="sm"
                variant="ghost"
                className="gap-1.5 text-muted-foreground"
                onClick={() => addBackOption(backCandidates[0].id)}
                disabled={dialog.options.length >= 5}
              >
                <CornerUpLeft className="h-3.5 w-3.5" />
                Add Back
              </Button>
            )}
            {backCandidates.length > 1 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="gap-1.5 text-muted-foreground"
                    disabled={dialog.options.length >= 5}
                  >
                    <CornerUpLeft className="h-3.5 w-3.5" />
                    Add Back
                    <ChevronDown className="h-3 w-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-72 bg-card border-border" style={{ borderRadius: "2px" }}>
                  {backCandidates.map((c) => (
                    <DropdownMenuItem
                      key={c.id}
                      className="flex flex-col items-start gap-0.5 cursor-pointer"
                      onClick={() => addBackOption(c.id)}
                    >
                      <span className="text-xs text-muted-foreground/60" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>
                        {c.interactionName.toUpperCase()}
                      </span>
                      <span className="text-sm truncate w-full">{c.label || "(empty)"}</span>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
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
        </div>

        <div className="space-y-4">
          {dialog.options.map((option, oi) => (
            <div key={option.id} className="space-y-1.5">
              {/* Label row */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground w-5 shrink-0 text-right">{oi + 1}.</span>
                <Input
                  value={option.label}
                  onChange={(e) => updateOptionLabel(oi, e.target.value)}
                  className="bg-background border-border flex-1"
                  placeholder="Option label..."
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground/50 hover:text-destructive shrink-0"
                  onClick={() => removeOption(oi)}
                  disabled={dialog.options.length <= 1}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              {/* Target row (always shown; serves as the destination on skill check success) */}
              <div className="pl-7 space-y-1">
                <div className="flex items-center gap-2">
                  <Link2 className="h-3 w-3 text-muted-foreground/40 shrink-0" />
                  {renderTargetDropdown(
                    option.targetDialogId,
                    String(oi),
                    (id) => setOptionTarget(oi, id),
                    () => createAndLinkDialog(oi),
                  )}
                </div>

                {option.skillCheck ? (
                  /* Skill check header: skill name + DC + remove */
                  <div className="flex items-center gap-2">
                    <Dices className="h-3 w-3 text-primary/50 shrink-0" />
                    <Input
                      value={option.skillCheck.skill}
                      onChange={(e) => updateSkillCheckField(oi, { skill: e.target.value })}
                      placeholder="Skill name…"
                      className="bg-background border-border/60 h-7 text-xs flex-1"
                      style={{ borderRadius: "2px" }}
                    />
                    <span className="text-xs text-muted-foreground/40 shrink-0">DC</span>
                    <input
                      type="number"
                      value={option.skillCheck.dc}
                      onChange={(e) => updateSkillCheckField(oi, { dc: Math.max(1, Math.min(30, parseInt(e.target.value) || 10)) })}
                      className="w-8 bg-transparent text-xs text-muted-foreground/60 text-center tabular-nums border-b border-transparent hover:border-border focus:border-primary outline-none transition-colors"
                      min={1}
                      max={30}
                    />
                    <button
                      className="text-muted-foreground/30 hover:text-destructive/70 transition-colors shrink-0"
                      onClick={() => removeSkillCheck(oi)}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ) : (
                  <button
                    className="flex items-center gap-1 text-xs text-muted-foreground/25 hover:text-muted-foreground/50 transition-colors"
                    onClick={() => addSkillCheck(oi)}
                  >
                    <Dices className="h-3 w-3" />
                    Add skill check
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
