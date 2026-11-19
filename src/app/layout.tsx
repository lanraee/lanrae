import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { prisma } from "@/lib/prisma";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

async function getSeoMeta() {
  try {
    const rows = await prisma.siteContent.findMany({
      where: { key: { in: ['seo.title', 'seo.description', 'seo.ogImage', 'seo.keywords'] } },
    });
    const m: Record<string, string> = {};
    rows.forEach(r => { m[r.key] = r.value; });
    return m;
  } catch { return {}; }
}

export async function generateMetadata(): Promise<Metadata> {
  const m = await getSeoMeta();
  const title = m['seo.title'] || 'Lanrae.co.uk — Super Intelligence Product Engineering';
  const description = m['seo.description'] || 'Browse, buy, and support Super Intelligence products built by lanrae. Tutorials, tools, and digital goods.';
  const keywords = m['seo.keywords'] || 'Super Intelligence, SI engineering, AI products, lanrae, AI studio, artificial intelligence, tutorials';
  return {
    metadataBase: new URL('https://lanrae.co.uk'),
    title: { default: title, template: '%s | lanrae' },
    description,
    keywords,
    authors: [{ name: 'lanrae', url: 'https://lanrae.co.uk' }],
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.png', type: 'image/png', sizes: '1024x1024' },
      ],
      apple: [{ url: '/icon.png', sizes: '1024x1024', type: 'image/png' }],
      shortcut: '/favicon.ico',
    },
    openGraph: {
      title,
      description,
      url: 'https://lanrae.co.uk',
      siteName: 'lanrae',
      locale: 'en_GB',
      type: 'website',
      // opengraph-image.tsx auto-provides the 1200×630 image
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      // Twitter also picks up opengraph-image.tsx automatically
    },
    alternates: {
      canonical: 'https://lanrae.co.uk',
    },
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`h-full ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="min-h-full">
        {children}
      </body>
    </html>
  );
}
