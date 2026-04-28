import React from 'react';
import Sidebar from './Sidebar';

interface AppLayoutProps {
  children: React.ReactNode;
  role?: 'user' | 'admin';
}

export default function AppLayout({ children, role = 'user' }: AppLayoutProps) {
  return (
    <div className="flex h-screen bg-[hsl(var(--background))] overflow-hidden">
      <Sidebar role={role} />
      <main className="flex-1 overflow-y-auto scrollbar-thin">
        {children}
      </main>
    </div>
  );
}