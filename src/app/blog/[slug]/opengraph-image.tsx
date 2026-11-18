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
          background: 'linear-gradient(160deg, #05060f 0%, #080a1a 100%)',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          overflow: 'hidden',
        }}
      >
        <div style={{
          position: 'absolute', top: -100, left: -80,
          width: 600, height: 600, borderRadius: '50%',
          background: 'rgba(124,108,255,0.2)',
          display: 'flex', filter: 'blur(55px)',
        }} />
        <div style={{
          position: 'absolute', bottom: -60, right: -60,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(53,214,199,0.12)',
          display: 'flex', filter: 'blur(50px)',
        }} />

        {/* icon chip */}
        <div style={{
          margin: '64px 0 0 64px',
          width: 96, height: 96, borderRadius: 24,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 48, background: gradient,
          boxShadow: '0 20px 50px rgba(0,0,0,.35)',
        }}>
          {icon}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', padding: '40px 64px 64px', flex: 1, justifyContent: 'flex-end' }}>
          <div style={{
            fontSize: 15, fontWeight: 700, letterSpacing: 4, color: '#35d6c7',
            textTransform: 'uppercase', marginBottom: 18, display: 'flex',
          }}>
            {category} · lanrae.co.uk/blog
          </div>

          <div style={{
            fontSize: 52, fontWeight: 800, color: '#eef1fb', lineHeight: 1.15,
            letterSpacing: -1.5, marginBottom: 20, display: 'flex', maxWidth: 1050,
          }}>
            {title}
          </div>

          <div style={{
            fontSize: 22, color: '#a7aecb', lineHeight: 1.5, display: 'flex',
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
