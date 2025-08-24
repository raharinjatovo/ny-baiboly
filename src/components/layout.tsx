/**
 * Main layout component for the Bible application
 * Provides consistent content structure (without navigation since root layout handles it)
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { Github, Heart } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* About Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Momba ny Baiboly</h3>
              <p className="text-sm text-muted-foreground">
                Fampianarana ny Tenin'Andriamanitra amin'ny teny Malagasy ho an'ny rehetra. 
                Mahafaka sy maimaim-poana.
              </p>
            </div>

            {/* Resources Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Loharanon-kevitra</h3>
              <div className="space-y-2">
                <Link
                  href="https://github.com/RaveloMevaSoavina/baiboly-json"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  <Github className="h-4 w-4" />
                  Baiboly JSON Data
                </Link>
                <p className="text-xs text-muted-foreground">
                  Ny angon-drakitra Baiboly ampiasaina amin'ity fampiharana ity
                </p>
              </div>
            </div>

            {/* Contact Section */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Fifandraisana</h3>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Heart className="h-4 w-4 text-red-500" />
                Nataon'ny fitiavana ho an'i Kristy
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-8 pt-4 border-t border-border">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} Ny Baiboly. Ny zo rehetra voaaro.
              </p>
              <div className="flex items-center gap-4">
                <Link
                  href="/about"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Momba anay
                </Link>
                <Link
                  href="/privacy"
                  className="text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Politika momba ny fiainana manokana
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
