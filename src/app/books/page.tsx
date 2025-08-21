/**
 * Books listing page - Shows all Bible books organized by testament
 * Implements proper SEO and accessibility
 */

import { Metadata } from "next";
import { Layout } from "@/components/layout";
import { TestamentSection } from "@/components/bible/book-card";
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from "@/constants/bible";
import { Testament } from "@/types/bible";

export const metadata: Metadata = {
  title: "Ny Boky rehetra - Ny Baiboly",
  description: "Jereo ny boky rehetra ao amin'ny Baiboly: Testameta Taloha (39 boky) sy Testameta Vaovao (27 boky)",
  openGraph: {
    title: "Ny Boky rehetra - Ny Baiboly",
    description: "Jereo ny boky rehetra ao amin'ny Baiboly",
  },
};

export default function BooksPage() {
  return (
    <Layout>
      <div className="space-y-8">
        {/* Page Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold text-foreground">
            Ny Boky rehetra
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Safidio ny boky tianao ho vakina. Ny Baiboly dia ahitana boky 66 
            izay mizara ho Testameta Taloha sy Testameta Vaovao.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-md mx-auto">
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-foreground">66</div>
            <div className="text-sm text-muted-foreground">Boky</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-foreground">39</div>
            <div className="text-sm text-muted-foreground">TT</div>
          </div>
          <div className="text-center p-4 bg-accent rounded-lg">
            <div className="text-2xl font-bold text-foreground">27</div>
            <div className="text-sm text-muted-foreground">TV</div>
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
    </Layout>
  );
}
