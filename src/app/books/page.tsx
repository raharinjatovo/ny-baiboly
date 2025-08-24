/**
 * Books listing page - Shows all Bible books organized by testament
 * Implements proper SEO and accessibility
 */

import { Metadata } from "next";
import { TestamentSection } from "@/components/bible/book-card";
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from "@/constants/bible";
import { Testament } from "@/types/bible";
import PageLayout from "@/components/layout/page-layout";

export const metadata: Metadata = {
  title: "Ny Boky rehetra - Ny Baiboly",
  description: "Jereo ny boky rehetra ao amin'ny Baiboly: Testameta Taloha (39 boky) sy Testameta Vaovao (27 boky)",
  openGraph: {
    title: "Ny Boky rehetra - Ny Baiboly",
    description: "Jereo ny boky rehetra ao amin'ny Baiboly",
  },
};

export default function BooksPage() {
  const breadcrumbs = [
    { label: 'Boky', current: true }
  ];

  return (
    <PageLayout
      title="Ny Boky rehetra"
      description="Safidio ny boky tianao ho vakina. Ny Baiboly dia ahitana boky 66 izay mizara ho Testameta Taloha sy Testameta Vaovao."
      breadcrumbs={breadcrumbs}
    >
      <div className="p-6 space-y-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">66</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">Boky</div>
          </div>
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">39</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TT</div>
          </div>
          <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">27</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">TV</div>
          </div>
        </div>

        {/* Old Testament Section */}
        <TestamentSection 
          testament={Testament.OLD}
          books={OLD_TESTAMENT_BOOKS}
        />

        {/* New Testament Section */}
        <TestamentSection 
          testament={Testament.NEW}
          books={NEW_TESTAMENT_BOOKS}
        />
      </div>
    </PageLayout>
  );
}
