import type { Metadata } from 'next';
import { PlayView } from './PlayView';

const title = 'Snake — a quick break';
const description = 'Classic Nokia-style Snake. Arrow keys, WASD, or the on-screen D-pad.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/play' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/play', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function PlayPage() {
  return <PlayView />;
}
