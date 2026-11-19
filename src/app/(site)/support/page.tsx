import type { Metadata } from 'next';
import { SupportView } from './SupportView';

const title = 'Support — Send a one-off tip';
const description = 'Buy lanrae a GPU hour. Every tip goes straight into building the next product.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/support' },
  openGraph: {
    title,
    description,
    url: 'https://lanrae.co.uk/support',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function SupportPage() {
  return <SupportView />;
}
