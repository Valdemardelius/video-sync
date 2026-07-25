import type { ReactNode } from 'react';
import ThemeToggle from './ThemeToggle';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
          🎬 Video Sync
        </h1>
        <ThemeToggle />
      </header>

      <main className="px-6 py-8">{children}</main>
    </div>
  );
}