import type { Metadata } from 'next';
import { Suspense } from 'react';
import { ProfileView } from './ProfileView';

const title = 'Member Profile — lanrae';
const description = 'Sign in to manage your member profile and chat with lanrae.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/profile' },
  openGraph: { title, description, url: 'https://lanrae.co.uk/profile', type: 'website' },
  twitter: { card: 'summary_large_image', title, description },
};

export default function ProfilePage() {
  return (
    <Suspense fallback={null}>
      <ProfileView />
    </Suspense>
  );
}
