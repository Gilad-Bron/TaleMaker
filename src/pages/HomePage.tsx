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
      <div className="px-6 py-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl text-foreground/80" style={{ fontFamily: "var(--font-heading)" }}>
            Tales
            {tales.length > 0 && (
              <span className="ml-2 text-sm text-muted-foreground/50 font-body" style={{ fontFamily: "var(--font-body)" }}>
                {tales.length}
              </span>
            )}
          </h1>
          <NewTaleDialog onCreate={handleCreate} />
        </div>
        <TaleGrid tales={tales} onDelete={deleteTale} />
      </div>
    </AppShell>
  );
}
