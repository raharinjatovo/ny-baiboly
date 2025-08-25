/**
 * Individual book page - Shows chapters for a specific Bible book
 * Implements dynamic routing with proper error handling
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, BookOpen } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { BibleBreadcrumb } from "@/components/bible/verse-display";
import { getBibleBook } from "@/lib/bible-data";
import { getBookById } from "@/lib/bible-data";
import { ChapterNavigationCard, ChapterNavigationButton } from "@/components/navigation/ChapterNavigationCard";

interface BookPageProps {
  params: Promise<{ bookId: string }>;
}

export async function generateMetadata({ params }: BookPageProps): Promise<Metadata> {
  const { bookId } = await params;
  const book = getBookById(bookId);
  
  if (!book) {
    return {
      title: "Boky tsy hita - Ny Baiboly",
    };
  }

  return {
    title: `${book.name} - Ny Baiboly`,
    description: `Vakio ny boky ${book.name} amin'ny ${book.testament}`,
    openGraph: {
      title: `${book.name} - Ny Baiboly`,
      description: `Vakio ny boky ${book.name}`,
    },
  };
}

export default async function BookPage({ params }: BookPageProps) {
  const { bookId } = await params;
  
  // Get book metadata
  const bookMeta = getBookById(bookId);
  if (!bookMeta) {
    notFound();
  }

  // Load book data
  const bookResponse = await getBibleBook(bookId);
  if (!bookResponse.success || !bookResponse.data) {
    notFound();
  }

  const book = bookResponse.data;
  const chapterCount = Object.keys(book.chapters).length;
  
  // Generate chapter list
  const chapters = Object.keys(book.chapters)
    .filter(key => !isNaN(parseInt(key))) // Filter out non-numeric keys like "meta"
    .map(num => parseInt(num))
    .sort((a, b) => a - b)
    .map(num => num.toString());

  return (
    <Layout>
      <div className="space-y-6">
        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost" size="sm">
            <Link href="/books">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Hiverina any amin'ny boky rehetra
            </Link>
          </Button>
        </div>

        {/* Breadcrumb */}
        <BibleBreadcrumb 
          book={book.name}
        />

        {/* Book Header */}
        <div className="text-center space-y-4 py-8 border-b">
          <h1 className="text-4xl font-bold text-foreground">
            {book.name}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-muted-foreground">
            <span className="flex items-center">
              <BookOpen className="mr-1 h-4 w-4" />
              {chapterCount} toko
            </span>
            <span className="text-sm px-3 py-1 bg-accent rounded-full">
              {book.testament}
            </span>
          </div>
        </div>

        {/* Chapters Grid */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-foreground">
            Safidio ny toko
          </h2>
          
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
            {chapters.map((chapterNum) => (
              <ChapterNavigationCard
                key={chapterNum}
                bookId={book.id}
                chapterNumber={chapterNum}
              />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-accent rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">
            Fiasa haingana
          </h3>
          <div className="flex flex-wrap gap-3">
            <ChapterNavigationButton
              bookId={book.id}
              chapterNumber="1"
              variant="outline"
            >
              Manomboka amin'ny toko voalohany
            </ChapterNavigationButton>
            <Button asChild variant="outline">
              <Link href={`/search?book=${book.id}`}>
                Hitady amin'ity boky ity
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
