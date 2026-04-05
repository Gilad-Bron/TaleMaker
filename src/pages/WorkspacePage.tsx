import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import AppShell from "@/components/layout/AppShell";
import WorkspaceLayout from "@/components/workspace/WorkspaceLayout";
import WorkspaceBreadcrumb from "@/components/workspace/Breadcrumb";
import TreeView from "@/components/workspace/sidebar/TreeView";
import TaleEditor from "@/components/workspace/editors/TaleEditor";
import ChapterEditor from "@/components/workspace/editors/ChapterEditor";
import EpisodeEditor from "@/components/workspace/editors/EpisodeEditor";
import InteractionEditor from "@/components/workspace/editors/InteractionEditor";
import DialogEditor from "@/components/workspace/editors/DialogEditor";
import { useTale } from "@/hooks/useTale";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import type { Tale, SelectedNode } from "@/types/tale";

function EditorPanel({
  tale,
  selectedNode,
  updateTale,
  onSelect,
}: {
  tale: Tale;
  selectedNode: SelectedNode;
  updateTale: (updater: (t: Tale) => Tale) => void;
  onSelect: (node: SelectedNode) => void;
}) {
  switch (selectedNode.type) {
    case "tale":
      return <TaleEditor tale={tale} updateTale={updateTale} />;
    case "chapter": {
      const chapter = tale.chapters[selectedNode.chapterIndex!];
      if (!chapter) return null;
      return (
        <ChapterEditor
          tale={tale}
          chapterIndex={selectedNode.chapterIndex!}
          updateTale={updateTale}
          onSelect={onSelect}
        />
      );
    }
    case "episode": {
      const episode = tale.chapters[selectedNode.chapterIndex!]?.episodes[selectedNode.episodeIndex!];
      if (!episode) return null;
      return (
        <EpisodeEditor
          tale={tale}
          chapterIndex={selectedNode.chapterIndex!}
          episodeIndex={selectedNode.episodeIndex!}
          updateTale={updateTale}
          onSelect={onSelect}
        />
      );
    }
    case "interaction": {
      const interaction = tale.chapters[selectedNode.chapterIndex!]?.episodes[selectedNode.episodeIndex!]?.interactions[selectedNode.interactionIndex!];
      if (!interaction) return null;
      return (
        <InteractionEditor
          tale={tale}
          chapterIndex={selectedNode.chapterIndex!}
          episodeIndex={selectedNode.episodeIndex!}
          interactionIndex={selectedNode.interactionIndex!}
          updateTale={updateTale}
          onSelect={onSelect}
        />
      );
    }
    case "dialog": {
      const dialog = tale.chapters[selectedNode.chapterIndex!]?.episodes[selectedNode.episodeIndex!]?.interactions[selectedNode.interactionIndex!]?.dialogs[selectedNode.dialogIndex!];
      if (!dialog) return null;
      return (
        <DialogEditor
          tale={tale}
          chapterIndex={selectedNode.chapterIndex!}
          episodeIndex={selectedNode.episodeIndex!}
          interactionIndex={selectedNode.interactionIndex!}
          dialogIndex={selectedNode.dialogIndex!}
          updateTale={updateTale}
        />
      );
    }
    default:
      return null;
  }
}

export default function WorkspacePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { tale, updateTale } = useTale(id!);
  const [selectedNode, setSelectedNode] = useState<SelectedNode>({ type: "tale" });

  if (!tale) {
    return (
      <AppShell>
        <div className="flex items-center justify-center h-64">
          <p className="text-muted-foreground">Loading tale...</p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <WorkspaceLayout
        sidebar={
          <TreeView tale={tale} selectedNode={selectedNode} onSelect={setSelectedNode} />
        }
        breadcrumb={
          <div className="flex items-center justify-between border-b border-border">
            <WorkspaceBreadcrumb tale={tale} selectedNode={selectedNode} onSelect={setSelectedNode} />
            <Button
              size="sm"
              className="mr-4 gap-1.5"
              onClick={() => navigate(`/tale/${id}/play`)}
            >
              <Play className="h-3.5 w-3.5" />
              Play
            </Button>
          </div>
        }
      >
        <EditorPanel
          tale={tale}
          selectedNode={selectedNode}
          updateTale={updateTale}
          onSelect={setSelectedNode}
        />
      </WorkspaceLayout>
    </AppShell>
  );
}
