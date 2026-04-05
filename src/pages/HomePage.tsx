import { useNavigate } from "react-router";
import AppShell from "@/components/layout/AppShell";
import TaleGrid from "@/components/home/TaleGrid";
import NewTaleDialog from "@/components/home/NewTaleDialog";
import { useTales } from "@/hooks/useTales";

export default function HomePage() {
  const { tales, addTale, deleteTale } = useTales();
  const navigate = useNavigate();

  const handleCreate = (title: string, description: string) => {
    const id = addTale(title, description);
    navigate(`/tale/${id}`);
  };

  return (
    <AppShell>
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-heading text-primary">Your Tales</h1>
            <p className="text-muted-foreground mt-1">Create and manage your text-based RPG adventures.</p>
          </div>
          <NewTaleDialog onCreate={handleCreate} />
        </div>
        <TaleGrid tales={tales} onDelete={deleteTale} />
      </div>
    </AppShell>
  );
}
