import type { Metadata } from 'next';
import { FansView } from './FansView';

const title = 'Fans — Hall of fame';
const description = 'The people funding the future. Ranked by total support.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/fans' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/fans', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function FansPage() {
  return <FansView />;
}
