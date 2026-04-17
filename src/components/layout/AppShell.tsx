import { ReactNode } from "react";

interface AppShellProps {
  children: ReactNode;
  fullScreen?: boolean;
}

export default function AppShell({ children, fullScreen }: AppShellProps) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {!fullScreen && (
        <header className="border-b border-border/50 px-6 py-3">
          <a
            href="/"
            className="text-lg text-primary/80 hover:text-primary transition-colors no-underline"
            style={{ fontFamily: "var(--font-display)", letterSpacing: "0.12em" }}
          >
            TaleMaker
          </a>
        </header>
      )}
      <main className={fullScreen ? "h-screen" : ""}>{children}</main>
    </div>
  );
}
