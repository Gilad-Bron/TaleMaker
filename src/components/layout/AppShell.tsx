import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  fullScreen?: boolean;
}

export default function AppShell({ children, fullScreen }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {!fullScreen && (
        <header className="border-b border-border px-6 py-3 flex items-center justify-between">
          <a href="/" className="text-2xl font-heading text-primary tracking-wide hover:text-primary/80 transition-colors">
            TaleMaker
          </a>
        </header>
      )}
      <main className={fullScreen ? "h-screen" : ""}>{children}</main>
    </div>
  );
}
