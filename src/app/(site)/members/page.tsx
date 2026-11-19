import type { Metadata } from 'next';
import { MembersView } from './MembersView';

const title = 'Members — Back the build';
const description = 'Join the studio. Members fund what gets built next and top supporters get their name on the wall.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/members' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/members', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function MembersPage() {
  return <MembersView />;
}
