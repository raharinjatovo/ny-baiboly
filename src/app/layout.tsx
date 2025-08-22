import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navigation/navbar";
import Footer from "@/components/navigation/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Ny Baiboly - Baiboly amin'ny teny Malagasy",
  description: "Mamakia ny Baiboly amin'ny teny Malagasy. Jereo ny Testameta Taloha sy ny Testameta Vaovao, hitady andinin-tsoratra, ary mitahiry ireo tiananao.",
  keywords: ["Baiboly", "Malagasy", "Bible", "Madagascar", "Christianity", "Scripture"],
  authors: [{ name: "Ny Baiboly Team" }],
  creator: "Ny Baiboly Team",
  publisher: "Ny Baiboly",
  robots: "index, follow",
  openGraph: {
    type: "website",
    locale: "mg_MG",
    url: "https://ny-baiboly.vercel.app",
    siteName: "Ny Baiboly",
    title: "Ny Baiboly - Baiboly amin'ny teny Malagasy",
    description: "Mamakia ny Baiboly amin'ny teny Malagasy. Jereo ny Testameta Taloha sy ny Testameta Vaovao.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ny Baiboly - Baiboly amin'ny teny Malagasy",
    description: "Mamakia ny Baiboly amin'ny teny Malagasy",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mg" dir="ltr">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}
      >
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
