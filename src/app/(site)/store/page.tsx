import type { Metadata } from 'next';
import { StoreView } from './StoreView';

const title = 'Store — ship-ready SI products';
const description = 'Own lanrae’s products outright, or unlock the full shelf with an Insider membership. Plus a reference directory of security tooling.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/store' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/store', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function StorePage() {
  return <StoreView />;
}
