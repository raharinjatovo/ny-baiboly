/**
 * Home page - Main entry point for the Bible application
 * Displays featured content, recent books, and navigation options
 */

import Link from "next/link";
import { Book, BookOpen, Heart, Search, Star, Users } from "lucide-react";
import { Layout } from "@/components/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BibleBookGrid } from "@/components/bible/book-card";
import { BookNavigationButton } from "@/components/navigation/BookNavigationButton";
import { OLD_TESTAMENT_BOOKS, NEW_TESTAMENT_BOOKS } from "@/constants/bible";

export default function HomePage() {
  // Get sample of popular books for quick access
  const popularBooks = [
    OLD_TESTAMENT_BOOKS.find(book => book.id === 'genesis')!,
    OLD_TESTAMENT_BOOKS.find(book => book.id === 'psalms')!,
    NEW_TESTAMENT_BOOKS.find(book => book.id === 'matthew')!,
    NEW_TESTAMENT_BOOKS.find(book => book.id === 'john')!,
  ];

  return (
    <Layout>
      <div className="space-y-12">
        {/* Hero Section */}
        <section className="text-center space-y-6 py-12">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground">
              Tonga soa eto amin'ny{" "}
              <span className="text-primary">Baiboly</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Mamakia ny Tenin'Andriamanitra amin'ny teny Malagasy. 
              Jereo ny Testameta Taloha sy ny Testameta Vaovao, 
              hitady andinin-tsoratra, ary mitahiry ireo tiananao.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/books">
                <BookOpen className="mr-2 h-5 w-5" />
                Hanomboka hamaky
              </Link>
            </Button>
            
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/search">
                <Search className="mr-2 h-5 w-5" />
                Hitady andinin-tsoratra
              </Link>
            </Button>
          </div>
        </section>

        {/* Features Section */}
        <section className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<Book className="h-8 w-8" />}
            title="66 Boky"
            description="Ny Testameta Taloha (39 boky) sy ny Testameta Vaovao (27 boky) feno"
            href="/books"
            linkText="Jereo ny boky rehetra"
          />
          
          <FeatureCard
            icon={<Search className="h-8 w-8" />}
            title="Fikarohana"
            description="Hitady andinin-tsoratra amin'ny Baiboly rehetra miaraka amin'ny fijerena tsara"
            href="/search"
            linkText="Manomboka ny fikarohana"
          />
          
          <FeatureCard
            icon={<Heart className="h-8 w-8" />}
            title="Ankafiziko"
            description="Tehirizo ireo andinin-tsoratra tiananao mba hahafahanao miverina mijery"
            href="/favorites"
            linkText="Jereo ny ankafiziko"
          />
        </section>

        {/* Popular Books Section */}
        <section className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold text-foreground">
              Boky malaza
            </h2>
            <p className="text-muted-foreground">
              Ireo boky vakiana matetika indrindra
            </p>
          </div>
          
          <BibleBookGrid 
            books={popularBooks}
            columns={4}
            showTestament={true}
          />
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard
            icon={<Book className="h-6 w-6" />}
            number="66"
            label="Boky"
          />
          <StatCard
            icon={<BookOpen className="h-6 w-6" />}
            number="1,189"
            label="Toko"
          />
          <StatCard
            icon={<Star className="h-6 w-6" />}
            number="31,102"
            label="Andinin-tsoratra"
          />
          <StatCard
            icon={<Users className="h-6 w-6" />}
            number="2"
            label="Testameta"
          />
        </section>

        {/* Call to Action */}
        <section className="bg-accent rounded-lg p-8 text-center space-y-4">
          <h3 className="text-2xl font-bold text-foreground">
            Manomboka ny dianao amin'ny fianarana ny Baiboly
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Na vaovao ianao na efa manam-pahaizana, dia misy zavatra ho anao eto. 
            Manomboka amin'ny boky voalohany na mitady zavatra manokana.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <BookNavigationButton 
              bookId="genesis" 
              size="lg"
              loadingText="Misokatra ny Genesisy..."
            >
              Manomboka amin'ny Genesisy
            </BookNavigationButton>
            <Button asChild variant="outline" size="lg">
              <Link href="/books">
                Hizaha ny boky rehetra
              </Link>
            </Button>
          </div>
        </section>
      </div>
    </Layout>
  );
}

/**
 * Feature card component
 */
interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  linkText: string;
}

function FeatureCard({ icon, title, description, href, linkText }: FeatureCardProps) {
  return (
    <Card className="text-center h-full">
      <CardHeader>
        <div className="mx-auto text-primary mb-4">
          {icon}
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Button asChild variant="outline" className="w-full">
          <Link href={href as "/books" | "/search" | "/favorites"}>{linkText}</Link>
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * Statistics card component
 */
interface StatCardProps {
  icon: React.ReactNode;
  number: string;
  label: string;
}

function StatCard({ icon, number, label }: StatCardProps) {
  return (
    <Card className="text-center">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center mb-2 text-primary">
          {icon}
        </div>
        <div className="text-2xl font-bold text-foreground mb-1">
          {number}
        </div>
        <div className="text-sm text-muted-foreground">
          {label}
        </div>
      </CardContent>
    </Card>
  );
}
