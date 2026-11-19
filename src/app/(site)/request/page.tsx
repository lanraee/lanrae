import type { Metadata } from 'next';
import { RequestView } from './RequestView';

const title = 'Request a build';
const description = 'Got an idea? Tell lanrae what you want built — top-voted requests shape the roadmap.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/request' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/request', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function RequestPage() {
  return <RequestView />;
}
