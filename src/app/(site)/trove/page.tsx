import type { Metadata } from 'next';
import { TroveAgentView } from './TroveAgentView';

const title = 'TroveAgent — AI build assistant';
const description = 'Ask TroveAgent about design, code, branding, or anything else you need built.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/trove' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/trove', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function TrovePage() {
  return <TroveAgentView />;
}
