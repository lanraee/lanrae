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
        {/* hairline accent rule */}
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 4, background: '#d9872e', display: 'flex' }} />

        {/* eyebrow */}
        <div style={{
          fontSize: 17, fontWeight: 500, letterSpacing: 1,
          color: '#96907f', marginBottom: 22, display: 'flex',
        }}>
          SI Product Engineering
        </div>

        {/* wordmark */}
        <div style={{
          fontSize: 104, fontWeight: 700, color: '#ede8dc',
          letterSpacing: -3, lineHeight: 1,
          marginBottom: 26, display: 'flex',
        }}>
          lanrae
        </div>

        {/* tagline */}
        <div style={{
          fontSize: 27, color: '#96907f', textAlign: 'left',
          maxWidth: 760, lineHeight: 1.45, fontWeight: 400,
          display: 'flex',
        }}>
          I build what I ship. Products, memberships, and a running build log.
        </div>

        {/* domain badge */}
        <div style={{
          marginTop: 46,
          display: 'flex', alignItems: 'center', gap: 10,
          border: '1px solid #322e27',
          padding: '10px 22px',
        }}>
          <div style={{
            width: 7, height: 7, borderRadius: '50%',
            background: '#d9872e', display: 'flex',
          }} />
          <div style={{ fontSize: 19, color: '#ede8dc', fontWeight: 500, display: 'flex' }}>
            lanrae.co.uk
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
