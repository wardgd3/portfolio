import type { ReactNode } from 'react';
import { Nav } from './Nav';
import { Footer } from './Footer';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
