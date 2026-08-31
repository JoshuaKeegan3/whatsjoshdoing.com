import type { Metadata } from "next";
import { Martian_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "./ConvexClientProvider";
import Spine from "@/components/Spine";

/** Machine voice: the hero readout, identifiers, timestamps, data. */
const martian = Martian_Mono({
  variable: "--font-martian",
  subsets: ["latin"],
});

/** Human voice: essays and anything Josh wrote in sentences. */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "What's Josh doing",
  description:
    "A live readout of what Josh Keegan is working on, plus the record of what he has finished.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The font variables must sit on :root, not on body: `@theme` resolves
    // --font-mono against :root, and a var defined lower down cannot satisfy it.
    <html lang="en" className={`${martian.variable} ${newsreader.variable}`}>
      <body>
        <ConvexClientProvider>
          <Spine />
          <main className="md:pl-spine print-plain">{children}</main>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
