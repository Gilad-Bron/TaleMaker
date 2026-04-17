import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface NewTaleDialogProps {
  onCreate: (title: string, description: string) => void;
}

export default function NewTaleDialog({ onCreate }: NewTaleDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleCreate = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), description.trim());
    setTitle("");
    setDescription("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 shrink-0" style={{ borderRadius: "2px" }}>
          <Plus className="h-4 w-4" />
          <span style={{ fontFamily: "var(--font-display)", letterSpacing: "0.08em" }}>New Tale</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-card border-border/80" style={{ borderRadius: "2px", maxWidth: "480px" }}>
        <DialogHeader className="pb-2">
          <DialogTitle className="text-xl text-primary" style={{ fontFamily: "var(--font-heading)" }}>
            New Tale
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-5 py-4">
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input
              placeholder="The Lost Kingdom..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              className="bg-background border-border/60 text-base"
              style={{ borderRadius: "2px" }}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Description</label>
            <Textarea
              placeholder="A tale of adventure and mystery..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-background border-border/60 resize-none text-base"
              style={{ borderRadius: "2px" }}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            onClick={() => setOpen(false)}
            className="text-muted-foreground hover:text-foreground"
            style={{ borderRadius: "2px" }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleCreate}
            disabled={!title.trim()}
            style={{ borderRadius: "2px" }}
          >
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
