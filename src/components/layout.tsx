/**
 * Main layout component for the Bible application
 * Provides consistent navigation and structure
 */

'use client';

import * as React from 'react';
import { Navbar, Sidebar } from '@/components/ui/navigation';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar 
        onMenuToggle={() => setSidebarOpen(true)}
        showMenuButton={true}
      />

      {/* Mobile Sidebar */}
      <Sidebar 
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
