/**
 * Main layout component for the Bible application
 * Provides consistent content structure (without navigation since root layout handles it)
 */

'use client';

import * as React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
