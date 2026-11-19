import type { Metadata } from 'next';
import { ToolsView } from './ToolsView';

const title = 'WhiteHat Tools — OSINT4ALL';
const description = 'A curated directory of OSINT, anonymity, and recon tools — educational and research use only.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/tools' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/tools', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function ToolsPage() {
  return <ToolsView />;
}
