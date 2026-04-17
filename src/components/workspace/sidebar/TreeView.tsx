import type { Tale, SelectedNode } from "@/types/tale";
import TreeNode from "./TreeNode";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BookOpen, Scroll, Film, User, MapPin, MessageSquare } from "lucide-react";

interface TreeViewProps {
  tale: Tale;
  selectedNode: SelectedNode;
  onSelect: (node: SelectedNode) => void;
  pickerActive?: boolean;
  onDialogPick?: (dialogId: string) => void;
}

function isNodeSelected(a: SelectedNode, b: SelectedNode): boolean {
  return (
    a.type === b.type &&
    a.chapterIndex === b.chapterIndex &&
    a.episodeIndex === b.episodeIndex &&
    a.interactionIndex === b.interactionIndex &&
    a.dialogIndex === b.dialogIndex
  );
}

export default function TreeView({ tale, selectedNode, onSelect, pickerActive, onDialogPick }: TreeViewProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Sidebar header */}
      <div className="px-4 py-3 border-b border-sidebar-border/60 shrink-0">
        {pickerActive ? (
          <p
            className="text-xs tracking-[0.15em] uppercase text-primary animate-pulse"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ✦ Select a dialog
          </p>
        ) : (
          <p
            className="text-xs text-muted-foreground/50 tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Contents
          </p>
        )}
      </div>
      <ScrollArea className="flex-1">
        <div className="py-2">
          <TreeNode
            label={tale.title || "Untitled Tale"}
            icon={<BookOpen className="h-3.5 w-3.5 text-primary" />}
            isSelected={isNodeSelected(selectedNode, { type: "tale" })}
            depth={0}
            onClick={() => onSelect({ type: "tale" })}
            hasChildren={tale.chapters.length > 0}
            dimmed={pickerActive}
          >
            {tale.chapters.map((chapter, ci) => (
              <TreeNode
                key={chapter.id}
                label={chapter.title || "Untitled Chapter"}
                icon={<Scroll className="h-3.5 w-3.5 text-primary/70" />}
                isSelected={isNodeSelected(selectedNode, { type: "chapter", chapterIndex: ci })}
                depth={1}
                onClick={() => onSelect({ type: "chapter", chapterIndex: ci })}
                hasChildren={chapter.episodes.length > 0}
                dimmed={pickerActive}
              >
                {chapter.episodes.map((episode, ei) => (
                  <TreeNode
                    key={episode.id}
                    label={episode.title || "Untitled Episode"}
                    icon={<Film className="h-3.5 w-3.5 text-primary/50" />}
                    isSelected={isNodeSelected(selectedNode, { type: "episode", chapterIndex: ci, episodeIndex: ei })}
                    depth={2}
                    onClick={() => onSelect({ type: "episode", chapterIndex: ci, episodeIndex: ei })}
                    hasChildren={episode.interactions.length > 0}
                    dimmed={pickerActive}
                  >
                    {episode.interactions.map((interaction, ii) => (
                      <TreeNode
                        key={interaction.id}
                        label={interaction.name || "Untitled"}
                        icon={interaction.type === "character"
                          ? <User className="h-3.5 w-3.5 text-accent" />
                          : <MapPin className="h-3.5 w-3.5 text-accent" />
                        }
                        isSelected={isNodeSelected(selectedNode, { type: "interaction", chapterIndex: ci, episodeIndex: ei, interactionIndex: ii })}
                        depth={3}
                        onClick={() => onSelect({ type: "interaction", chapterIndex: ci, episodeIndex: ei, interactionIndex: ii })}
                        hasChildren={interaction.dialogs.length > 0}
                        dimmed={pickerActive}
                      >
                        {interaction.dialogs.map((dialog, di) => (
                          <TreeNode
                            key={dialog.id}
                            label={dialog.text ? dialog.text.slice(0, 30) + (dialog.text.length > 30 ? "..." : "") : `Dialog ${di + 1}`}
                            icon={<MessageSquare className="h-3.5 w-3.5 text-muted-foreground" />}
                            isSelected={isNodeSelected(selectedNode, { type: "dialog", chapterIndex: ci, episodeIndex: ei, interactionIndex: ii, dialogIndex: di })}
                            depth={4}
                            onClick={pickerActive
                              ? () => onDialogPick?.(dialog.id)
                              : () => onSelect({ type: "dialog", chapterIndex: ci, episodeIndex: ei, interactionIndex: ii, dialogIndex: di })
                            }
                            isPicker={pickerActive}
                          />
                        ))}
                      </TreeNode>
                    ))}
                  </TreeNode>
                ))}
              </TreeNode>
            ))}
          </TreeNode>
        </div>
      </ScrollArea>
    </div>
  );
}
