import { ReactNode } from "react";

interface WorkspaceLayoutProps {
  sidebar: ReactNode;
  breadcrumb: ReactNode;
  children: ReactNode;
}

export default function WorkspaceLayout({ sidebar, breadcrumb, children }: WorkspaceLayoutProps) {
  return (
    <div className="flex h-[calc(100vh-53px)]">
      <aside className="w-64 shrink-0 border-r border-border bg-sidebar overflow-hidden">
        {sidebar}
      </aside>
      <div className="flex-1 flex flex-col overflow-hidden">
        {breadcrumb}
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </div>
    </div>
  );
}
