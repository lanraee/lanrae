import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: '#15130f',
          position: 'relative',
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          padding: '0 90px',
        }}
      >
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: '#d9872e', display: 'flex' }} />

        <div style={{ fontSize: 17, fontWeight: 500, letterSpacing: 1, color: '#96907f', marginBottom: 18, display: 'flex' }}>
          Tutorials &amp; build log
        </div>

        <div style={{ fontSize: 88, fontWeight: 700, color: '#ede8dc', letterSpacing: -3, lineHeight: 1, marginBottom: 10, display: 'flex' }}>
          lanrae
        </div>

        <div style={{ fontSize: 32, fontWeight: 600, color: '#d9872e', marginBottom: 26, display: 'flex' }}>
          /blog
        </div>

        <div style={{ fontSize: 24, color: '#96907f', textAlign: 'left', maxWidth: 700, lineHeight: 1.5, display: 'flex' }}>
          Tutorials, devlogs &amp; guides — networking, AI, dev tools and more.
        </div>

        <div style={{
          marginTop: 42, display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid #322e27', padding: '10px 22px',
        }}>
          <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d9872e', display: 'flex' }} />
          <div style={{ fontSize: 18, color: '#ede8dc', fontWeight: 500, display: 'flex' }}>lanrae.co.uk/blog</div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
