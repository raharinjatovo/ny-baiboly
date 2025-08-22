'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Book,
  Heart,
  ExternalLink,
  Github,
  Mail,
  Shield,
  Info,
  MessageSquare
} from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-3 text-xl font-bold text-blue-700 dark:text-blue-300 mb-4">
              <Book className="w-8 h-8" />
              <span>Ny Baiboly</span>
            </Link>
            <p className="text-gray-600 dark:text-gray-400 mb-4 max-w-md">
              Fampiharana Baiboly amin'ny teny Malagasy izay ahafahan'ny olona mamaky sy mandinika ny Soratra Masina amin'ny fomba mora sy mahomby.
            </p>
            <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
              <span>Naorina tamin'ny</span>
              <Heart className="w-4 h-4 text-red-500" />
              <span>ho an'ny vahoaka Malagasy</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Fikarohana</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/books" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Boky rehetra
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Fikarohana
                </Link>
              </li>
              <li>
                <Link href="/random" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Andinin-tsoratra kisendrasendra
                </Link>
              </li>
              <li>
                <Link href="/favorites" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  Tiako
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Info */}
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Fanampiana</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/about" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Mombamiko
                </Link>
              </li>
              <li>
                <Link href="/feedback" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                  <MessageSquare className="w-4 h-4" />
                  Andefaso hevitra
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Fiarovana
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  API Documentation
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bible Resources Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Loharanom-baiboly</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Ny angon-drakitra Baiboly ampiasaina ato dia avy amin'ny tahiry misokatra
            </p>
            <a
              href="https://github.com/RaveloMevaSoavina/baiboly-json/tree/master"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Github className="w-4 h-4" />
              baiboly-json Repository
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 dark:text-gray-400 text-sm">
              © {currentYear} Ny Baiboly. Avela ho an'ny rehetra.
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/feedback"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="Andefaso hevitra"
              >
                <Mail className="w-5 h-5" />
              </Link>
              <a
                href="https://github.com/RaveloMevaSoavina/baiboly-json"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                title="GitHub Repository"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
