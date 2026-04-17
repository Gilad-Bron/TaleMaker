import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  sidebar: ReactNode;
  breadcrumb: ReactNode;
  children: ReactNode;
}

export default function WorkspaceLayout({ sidebar, breadcrumb, children }: WorkspaceLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-57px)]">
      <aside className="w-72 shrink-0 border-r border-border/60 bg-sidebar overflow-hidden flex flex-col">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="border-b border-border/50 bg-background/60">
          {breadcrumb}
        </div>
        <div className="flex-1 overflow-y-auto p-8">{children}</div>
      </div>
    </div>
  );
}
