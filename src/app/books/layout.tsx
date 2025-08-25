/**
 * Books page layout with SEO metadata
 */

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ny Boky rehetra - Ny Baiboly",
  description: "Hitady sy hamaky ny boky rehetra ao amin'ny Baiboly: Testameta Taloha (39 boky) sy Testameta Vaovao (27 boky). Fitadiavana haingana sy mora ampiasaina.",
  openGraph: {
    title: "Ny Boky rehetra - Ny Baiboly",
    description: "Hitady sy hamaky ny boky rehetra ao amin'ny Baiboly",
  },
  keywords: ["Baiboly", "boky", "testameta", "fitadiavana", "Genesisy", "Matio", "Salamo"],
};

export default function BooksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
