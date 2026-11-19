import { ImageResponse } from 'next/og';
import { prisma } from '@/lib/prisma';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function getPost(slug: string) {
  try {
    return await prisma.post.findFirst({ where: { OR: [{ slug }, { id: slug }] } });
  } catch {
    return null;
  }
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug);

  const title = post?.title ?? 'lanrae';
  const excerpt = post?.excerpt ?? 'Tutorials, devlogs & guides from lanrae.co.uk.';
  const category = post?.category ?? 'blog';
  const icon = post?.icon ?? '📝';
  const gradient = post?.gradient ?? 'linear-gradient(160deg,#7c6cff,#3a1d6e)';

  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          background: '#15130f',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: '#d9872e', display: 'flex' }} />

        {/* icon chip — real per-post color, not decoration */}
        <div style={{
          margin: '64px 0 0 64px',
          width: 88, height: 88, borderRadius: 3,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 44, background: gradient, border: '1px solid #322e27',
        }}>
          {icon}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 64px 64px', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{
            fontSize: 16, fontWeight: 500, color: '#96907f',
            marginBottom: 18, display: 'flex',
          }}>
            {category} · lanrae.co.uk/blog
          </div>

          <div style={{
            fontSize: 52, fontWeight: 700, color: '#ede8dc', lineHeight: 1.15,
            letterSpacing: -1.5, marginBottom: 20, display: 'flex', maxWidth: 1050,
          }}>
            {title}
          </div>

          <div style={{
            fontSize: 22, color: '#96907f', lineHeight: 1.5, display: 'flex',
            maxWidth: 950, overflow: 'hidden',
          }}>
            {excerpt}
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
