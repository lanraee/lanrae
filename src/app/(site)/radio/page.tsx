import type { Metadata } from 'next';
import { RadioView } from './RadioView';

const title = 'Radio';
const description = 'Live internet radio and a playlist — pick a station and press play.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/radio' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/radio', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function RadioPage() {
  return <RadioView />;
}
