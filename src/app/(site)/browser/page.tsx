import type { Metadata } from 'next';
import { BrowserView } from './BrowserView';

const title = 'Browser — bookmarks';
const description = 'A small in-page browser with a few bookmarked links.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/browser' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/browser', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function BrowserPage() {
  return <BrowserView />;
}
