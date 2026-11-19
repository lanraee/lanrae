import type { Metadata } from 'next';
import { prisma } from '@/lib/prisma';
import { PostView } from './PostView';

async function getPost(slug: string) {
  try {
    return await prisma.post.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    return { title: 'Post not found' };
  }

  const title = post.title;
  const description = post.excerpt || `A ${post.category} post by lanrae.`;
  const url = `https://lanrae.co.uk/blog/${post.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: 'article',
      publishedTime: post.publishedAt?.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default function Page() {
  return <PostView />;
}
