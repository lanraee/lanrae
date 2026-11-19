import type { Metadata } from 'next';
import { AboutView } from './AboutView';

const title = 'About — lanrae';
const description = 'Who’s building lanrae.co.uk, and why.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/about' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/about', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function AboutPage() {
  return <AboutView />;
}
