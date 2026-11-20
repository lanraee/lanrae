'use client';

import Link from 'next/link';
import { useContent } from '@/lib/useContent';

export function SiteFooter() {
  const { c } = useContent();

  return (
    <footer style={{
      borderTop: '1px solid var(--iron)', padding: '28px 24px',
      display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between',
      fontSize: 13, color: 'var(--ash)', fontFamily: 'var(--font-body)',
    }}>
      <span>{c('footer.tagline')}</span>
      <div style={{ display: 'flex', gap: 18 }}>
        <Link href="/about" style={{ color: 'var(--ash)', textDecoration: 'none' }}>{c('nav.about.label')}</Link>
        <Link href="/request" style={{ color: 'var(--ash)', textDecoration: 'none' }}>{c('nav.request.label')}</Link>
        <Link href="/support" style={{ color: 'var(--ash)', textDecoration: 'none' }}>{c('nav.support.label')}</Link>
      </div>
    </footer>
  );
}
