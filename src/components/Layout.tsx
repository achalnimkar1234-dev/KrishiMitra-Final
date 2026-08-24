import { type ReactNode } from 'react';
import { TopBar } from '@/components/TopBar';
import { Sidebar } from '@/components/Sidebar';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-cream-100">
      <TopBar />
      <div className="flex min-h-[calc(100vh-56px)]">
        <Sidebar />
        <main className="flex-1 p-4 pb-20 md:p-6 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
