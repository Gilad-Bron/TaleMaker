import type { Tale, SelectedNode } from "@/types/tale";

interface BreadcrumbProps {
  tale: Tale;
  selectedNode: SelectedNode;
  onSelect: (node: SelectedNode) => void;
}

export default function WorkspaceBreadcrumb({ tale, selectedNode, onSelect }: BreadcrumbProps) {
  const crumbs: { label: string; node: SelectedNode }[] = [
    { label: tale.title || "Tale", node: { type: "tale" } },
  ];

  if (selectedNode.chapterIndex != null) {
    const chapter = tale.chapters[selectedNode.chapterIndex];
    if (chapter) {
      crumbs.push({
        label: chapter.title || "Chapter",
        node: { type: "chapter", chapterIndex: selectedNode.chapterIndex },
      });
    }
  }

  if (selectedNode.episodeIndex != null && selectedNode.chapterIndex != null) {
    const episode = tale.chapters[selectedNode.chapterIndex]?.episodes[selectedNode.episodeIndex];
    if (episode) {
      crumbs.push({
        label: episode.title || "Episode",
        node: { type: "episode", chapterIndex: selectedNode.chapterIndex, episodeIndex: selectedNode.episodeIndex },
      });
    }
  }

  if (selectedNode.interactionIndex != null && selectedNode.episodeIndex != null && selectedNode.chapterIndex != null) {
    const interaction = tale.chapters[selectedNode.chapterIndex]?.episodes[selectedNode.episodeIndex]?.interactions[selectedNode.interactionIndex];
    if (interaction) {
      crumbs.push({
        label: interaction.name || "Interaction",
        node: {
          type: "interaction",
          chapterIndex: selectedNode.chapterIndex,
          episodeIndex: selectedNode.episodeIndex,
          interactionIndex: selectedNode.interactionIndex,
        },
      });
    }
  }

  if (selectedNode.dialogIndex != null && selectedNode.interactionIndex != null && selectedNode.episodeIndex != null && selectedNode.chapterIndex != null) {
    crumbs.push({
      label: `Dialog ${selectedNode.dialogIndex + 1}`,
      node: selectedNode,
    });
  }

  return (
    <div className="flex items-center gap-0.5 text-xs text-muted-foreground px-6 py-3 overflow-x-auto" style={{ fontFamily: "var(--font-display)", letterSpacing: "0.05em" }}>
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-0.5 shrink-0">
          {i > 0 && (
            <span className="mx-2 text-border/80 select-none">›</span>
          )}
          <button
            onClick={() => onSelect(crumb.node)}
            className={`hover:text-primary transition-colors px-0.5 ${
              i === crumbs.length - 1 ? "text-foreground/80" : "text-muted-foreground/70"
            }`}
          >
            {crumb.label}
          </button>
        </span>
      ))}
    </div>
  );
}
