import React from 'react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar placeholder */}
      <aside className="w-64 border-r p-4 hidden md:block">
        <nav className="font-semibold">Sola Learning</nav>
      </aside>
      <div className="flex-1 flex flex-col">
        {/* Header placeholder */}
        <header className="h-16 border-b px-6 flex items-center justify-between">
          <span className="font-medium">Dashboard</span>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
