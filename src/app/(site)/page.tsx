import type { Metadata } from 'next';
import { HomeView } from './HomeView';

const title = 'Lanrae.co.uk — Super Intelligence Product Engineering';
const description = 'Products, memberships, and a running build log from lanrae — engineered for the Super Intelligence era, shipped in the open.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk' },
  openGraph: { title, description, url: 'https://lanrae.co.uk', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function HomePage() {
  return <HomeView />;
}
