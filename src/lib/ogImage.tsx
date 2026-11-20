import type { ReactElement } from 'react';

/** Shared OG image layout for lanrae.co.uk — flat ink background, single beacon
 *  accent hairline, matches the site's Mission Control design tokens exactly
 *  (next/og can't read CSS custom properties, so hex values are repeated here). */
export function buildOgImage({ eyebrow, heading, tagline, path }: {
  eyebrow: string;
  heading: string;
  tagline: string;
  path: string;
}): ReactElement {
  return (
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
        {eyebrow}
      </div>

      <div style={{ fontSize: 88, fontWeight: 700, color: '#ede8dc', letterSpacing: -3, lineHeight: 1.05, marginBottom: 26, display: 'flex', maxWidth: 1000 }}>
        {heading}
      </div>

      <div style={{ fontSize: 26, color: '#96907f', textAlign: 'left', maxWidth: 760, lineHeight: 1.45, fontWeight: 400, display: 'flex' }}>
        {tagline}
      </div>

      <div style={{
        marginTop: 42, display: 'flex', alignItems: 'center', gap: 10,
        border: '1px solid #322e27', padding: '10px 22px',
      }}>
        <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#d9872e', display: 'flex' }} />
        <div style={{ fontSize: 18, color: '#ede8dc', fontWeight: 500, display: 'flex' }}>lanrae.co.uk{path}</div>
      </div>
    </div>
  );
}

export const ogImageSize = { width: 1200, height: 630 };
export const ogImageContentType = 'image/png';
