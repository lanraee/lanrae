import type { Metadata } from 'next';
import { BlogListView } from './BlogListView';

const title = 'Blog — Tutorials, devlogs & guides';
const description = 'Tutorials, devlogs, and guides from building real things — networking, AI, dev tools, and more.';

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: 'https://lanrae.co.uk/blog' },
  openGraph: {
    title,
    description,
    url: 'https://lanrae.co.uk/blog',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function BlogPage() {
  return <BlogListView />;
}
