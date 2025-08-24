'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home,
  Book,
  Search,
  Heart,
  Settings,
  Info,
  Shield,
  MessageSquare,
  Menu,
  X,
  Shuffle,
  BookOpen
} from 'lucide-react';

interface SubMenuItem {
  href: string;
  label: string;
  description?: string;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  submenu?: SubMenuItem[];
}

const navigationItems: NavItem[] = [
  {
    href: '/',
    label: 'Fandraisana',
    icon: <Home className="w-5 h-5" />,
    description: 'Pejy fandraisana'
  },
  {
    href: '/books',
    label: 'Boky',
    icon: <Book className="w-5 h-5" />,
    description: 'Lisitry ny boky rehetra'
  },
  {
    href: '/search',
    label: 'Fikarohana teny',
    icon: <Search className="w-5 h-5" />,
    description: 'Hitady andinin-tsoratra amin\'ny teny'
  },
  {
    href: '/search/reference',
    label: 'Fikarohana référence',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Hitady andinin-tsoratra amin\'ny boky sy toko'
  },
  {
    href: '/random',
    label: 'Kisendrasendra',
    icon: <Shuffle className="w-5 h-5" />,
    description: 'Andinin-tsoratra kisendrasendra'
  },
  {
    href: '/favorites',
    label: 'Tiako',
    icon: <Heart className="w-5 h-5" />,
    description: 'Andinin-tsoratra tiako'
  },
  {
    href: '/settings',
    label: 'Fandrindrana',
    icon: <Settings className="w-5 h-5" />,
    description: 'Fandrindrana ny fampiharana'
  }
];

const secondaryItems: NavItem[] = [
  {
    href: '/about',
    label: 'Mombamiko',
    icon: <Info className="w-5 h-5" />,
    description: 'Momba ny fampiharana'
  },
  {
    href: '/privacy',
    label: 'Fiarovana',
    icon: <Shield className="w-5 h-5" />,
    description: 'Politikan\'ny fiainana manokana'
  },
  {
    href: '/feedback',
    label: 'Hevitra',
    icon: <MessageSquare className="w-5 h-5" />,
    description: 'Andefaso hevitra'
  },
  {
    href: '/api-docs',
    label: 'API',
    icon: <BookOpen className="w-5 h-5" />,
    description: 'Tahirin-kevitra momba ny API'
  }
];

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const NavLink: React.FC<{ item: NavItem; mobile?: boolean }> = ({ item, mobile = false }) => (
    <Link
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      href={item.href as any}
      onClick={() => mobile && setIsOpen(false)}
      className={`
        flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200
        hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-900/20 dark:hover:text-blue-300
        ${isActive(item.href) 
          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium' 
          : 'text-gray-700 dark:text-gray-300'
        }
        ${mobile ? 'w-full justify-start text-base' : 'text-sm'}
      `}
      title={item.description}
    >
      {item.icon}
      <span className={mobile ? 'block' : 'hidden lg:block'}>{item.label}</span>
    </Link>
  );

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 text-xl font-bold text-blue-700 dark:text-blue-300">
            <Book className="w-8 h-8" />
            <span className="hidden sm:block">Ny Baiboly</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigationItems.slice(0, 3).map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>

          {/* Desktop Secondary Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigationItems.slice(3).map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
            {/* Add API Docs to main navigation */}
            <NavLink key="/api-docs" item={{
              href: '/api-docs',
              label: 'API',
              icon: <BookOpen className="w-5 h-5" />,
              description: 'Tahirin-kevitra momba ny API'
            }} />
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Ouvrir le menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-lg">
            <div className="px-4 py-4 space-y-2">
              {/* Primary Navigation */}
              <div className="space-y-1">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-1">
                  Fikarohana
                </h3>
                {navigationItems.map((item) => (
                  <NavLink key={item.href} item={item} mobile />
                ))}
              </div>

              {/* Secondary Navigation */}
              <div className="pt-4 space-y-1 border-t border-gray-200 dark:border-gray-700">
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-1">
                  Hafa
                </h3>
                {secondaryItems.map((item) => (
                  <NavLink key={item.href} item={item} mobile />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
