/**
 * Navigation components for the Bible application
 * Clean, accessible navigation following best practices
 */

'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Book, Menu, X, Search, Home, BookOpen, Heart, FileText, Shuffle } from 'lucide-react';
import { cn } from '@/utils';
import { Button } from './button';

/**
 * Main navigation bar component
 */
interface NavbarProps {
  onMenuToggle?: () => void;
  showMenuButton?: boolean;
}

export function Navbar({ onMenuToggle, showMenuButton = true }: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = React.useState(false);

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        {/* Mobile menu button */}
        {showMenuButton && (
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 md:hidden"
            onClick={onMenuToggle}
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        )}

        {/* Logo */}
        <Link href="/" className="mr-4 flex items-center space-x-2 lg:mr-6">
          <Book className="h-6 w-6" />
          <span className="hidden font-bold lg:inline-block">
            Ny Baiboly
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            <Button
              variant="outline"
              size="sm"
              className="inline-flex items-center whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input hover:bg-accent hover:text-accent-foreground px-4 py-2 relative h-8 w-full justify-start rounded-md bg-background text-sm font-normal text-muted-foreground shadow-none sm:pr-12 md:w-40 lg:w-64"
              onClick={() => setIsSearchOpen(true)}
            >
              <Search className="mr-2 h-4 w-4" />
              <span>Hitady...</span>
            </Button>
          </div>

          {/* Desktop navigation links */}
          <nav className="hidden md:flex md:items-center md:space-x-6">
            <NavLink href="/" icon={<Home className="h-4 w-4" />}>
              Fandraisana
            </NavLink>
            <NavLink href="/books" icon={<BookOpen className="h-4 w-4" />}>
              Boky
            </NavLink>
            <NavLink href="/random" icon={<Shuffle className="h-4 w-4" />}>
              Verset tsy ampoizina
            </NavLink>
            <NavLink href="/favorites" icon={<Heart className="h-4 w-4" />}>
              Ankafiziko
            </NavLink>
            <NavLink href="/api-docs" icon={<FileText className="h-4 w-4" />}>
              API Docs
            </NavLink>
          </nav>
        </div>
      </div>

      {/* Search overlay */}
      {isSearchOpen && (
        <SearchOverlay onClose={() => setIsSearchOpen(false)} />
      )}
    </nav>
  );
}

/**
 * Navigation link component with active state
 */
interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

function NavLink({ href, children, icon, className }: NavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={href as any}
      className={cn(
        'flex items-center space-x-2 text-sm font-medium transition-colors hover:text-foreground/80',
        isActive ? 'text-foreground' : 'text-foreground/60',
        className
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}

/**
 * Search overlay component
 */
interface SearchOverlayProps {
  onClose: () => void;
}

function SearchOverlay({ onClose }: SearchOverlayProps) {
  const [query, setQuery] = React.useState('');

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 sm:rounded-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Hitady amin'ny Baiboly</h3>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        
        <div className="grid gap-4">
          <div className="grid gap-2">
            <input
              type="text"
              placeholder="Sorato ny teny hitadiavinao..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={onClose}>
              Aoka ihany
            </Button>
            <Button onClick={() => console.info('Search:', query)}>
              Hitady
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Sidebar component for mobile navigation
 */
interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export function Sidebar({ isOpen, onClose, children }: SidebarProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 top-0 z-50 h-full w-80 transform border-r bg-background transition-transform duration-300 ease-in-out md:hidden',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <Link href="/" className="flex items-center space-x-2" onClick={onClose}>
            <Book className="h-6 w-6" />
            <span className="font-bold">Ny Baiboly</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        <div className="flex flex-col space-y-2 p-4">
          <MobileNavLink href="/" icon={<Home className="h-4 w-4" />} onClick={onClose}>
            Fandraisana
          </MobileNavLink>
          <MobileNavLink href="/books" icon={<BookOpen className="h-4 w-4" />} onClick={onClose}>
            Boky
          </MobileNavLink>
          <MobileNavLink href="/random" icon={<Shuffle className="h-4 w-4" />} onClick={onClose}>
            Verset tsy ampoizina
          </MobileNavLink>
          <MobileNavLink href="/favorites" icon={<Heart className="h-4 w-4" />} onClick={onClose}>
            Ankafiziko
          </MobileNavLink>
          <MobileNavLink href="/api-docs" icon={<FileText className="h-4 w-4" />} onClick={onClose}>
            API Docs
          </MobileNavLink>
        </div>

        {children && (
          <div className="border-t p-4">
            {children}
          </div>
        )}
      </div>
    </>
  );
}

/**
 * Mobile navigation link component
 */
interface MobileNavLinkProps {
  href: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  onClick?: () => void;
}

function MobileNavLink({ href, children, icon, onClick }: MobileNavLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={href as any}
      onClick={onClick}
      className={cn(
        'flex items-center space-x-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
        isActive
          ? 'bg-accent text-accent-foreground'
          : 'text-foreground/60 hover:bg-accent hover:text-accent-foreground'
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </Link>
  );
}
