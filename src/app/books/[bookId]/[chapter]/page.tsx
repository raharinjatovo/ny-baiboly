/**
 * Chapter reading page - Displays Bible chapter with verses
 * Optimized for reading experience with navigation controls
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, BookOpen, Heart } from "lucide-react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Chapter, BibleBreadcrumb } from "@/components/bible/verse-display";
import { getBibleBook, getChapter } from "@/lib/bible-data";
import { getBookById } from "@/lib/bible-data";

interface ChapterPageProps {
  params: Promise<{ bookId: string; chapter: string }>;
}

export async function generateMetadata({ params }: ChapterPageProps): Promise<Metadata> {
  const { bookId, chapter } = await params;
  const book = getBookById(bookId);
  
  if (!book) {
    return {
      title: "Toko tsy hita - Ny Baiboly",
    };
  }

  return {
    title: `${book.name} ${chapter} - Ny Baiboly`,
    description: `Vakio ny ${book.name} toko ${chapter} amin'ny teny Malagasy`,
    openGraph: {
      title: `${book.name} ${chapter} - Ny Baiboly`,
      description: `Vakio ny ${book.name} toko ${chapter}`,
    },
  };
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { bookId, chapter } = await params;
  
  // Get book metadata
  const bookMeta = getBookById(bookId);
  if (!bookMeta) {
    notFound();
  }

  // Load chapter data
  const chapterResponse = await getChapter(bookId, chapter);
  if (!chapterResponse.success || !chapterResponse.data) {
    notFound();
  }

  const verses = chapterResponse.data;
  
  // Get book data for navigation
  const bookResponse = await getBibleBook(bookId);
  const totalChapters = bookResponse.data ? Object.keys(bookResponse.data.chapters).length : 0;
  
  const currentChapterNum = parseInt(chapter);
  const prevChapter = currentChapterNum > 1 ? (currentChapterNum - 1).toString() : null;
  const nextChapter = currentChapterNum < totalChapters ? (currentChapterNum + 1).toString() : null;

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation Header */}
        <div className="flex items-center justify-between">
          <Button asChild variant="ghost" size="sm">
            <Link href={`/books/${bookId}`}>
              <ChevronLeft className="mr-2 h-4 w-4" />
              Hiverina any amin'ny {bookMeta.name}
            </Link>
          </Button>

          <div className="flex items-center space-x-2">
            <Button asChild variant="outline" size="icon" disabled={!prevChapter}>
              {prevChapter ? (
                <Link href={`/books/${bookId}/${prevChapter}`}>
                  <ChevronLeft className="h-4 w-4" />
                </Link>
              ) : (
                <span>
                  <ChevronLeft className="h-4 w-4" />
                </span>
              )}
            </Button>

            <span className="text-sm text-muted-foreground min-w-[100px] text-center">
              Toko {chapter} / {totalChapters}
            </span>

            <Button asChild variant="outline" size="icon" disabled={!nextChapter}>
              {nextChapter ? (
                <Link href={`/books/${bookId}/${nextChapter}`}>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              ) : (
                <span>
                  <ChevronRight className="h-4 w-4" />
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Breadcrumb */}
        <BibleBreadcrumb 
          book={bookMeta.name}
          chapter={chapter}
        />

        {/* Chapter Content */}
        <div className="bg-background border rounded-lg p-6 shadow-sm">
          <Chapter
            bookName={bookMeta.name}
            chapterNumber={chapter}
            verses={verses}
            showVerseNumbers={true}
          />
        </div>

        {/* Chapter Navigation */}
        <div className="flex items-center justify-between py-6 border-t">
          <div>
            {prevChapter && (
              <Button asChild variant="outline">
                <Link href={`/books/${bookId}/${prevChapter}`}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Toko {prevChapter}
                </Link>
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>

          <div>
            {nextChapter && (
              <Button asChild variant="outline">
                <Link href={`/books/${bookId}/${nextChapter}`}>
                  Toko {nextChapter}
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Reading Progress */}
        <div className="bg-accent rounded-lg p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              Fivoarana amin'ny famakiana
            </span>
            <span className="font-medium">
              {Math.round((currentChapterNum / totalChapters) * 100)}%
            </span>
          </div>
          <div className="mt-2 bg-background rounded-full h-2">
            <div 
              className="bg-primary rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentChapterNum / totalChapters) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </Layout>
  );
}
