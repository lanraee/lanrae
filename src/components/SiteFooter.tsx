import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer style={{
      borderTop: '1px solid var(--iron)', padding: '28px 24px',
      display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between',
      fontSize: 13, color: 'var(--ash)', fontFamily: 'var(--font-body)',
    }}>
      <span>lanrae.co.uk — built, shipped, and maintained by one person.</span>
      <div style={{ display: 'flex', gap: 18 }}>
        <Link href="/about" style={{ color: 'var(--ash)', textDecoration: 'none' }}>About</Link>
        <Link href="/request" style={{ color: 'var(--ash)', textDecoration: 'none' }}>Request a build</Link>
        <Link href="/support" style={{ color: 'var(--ash)', textDecoration: 'none' }}>Support</Link>
      </div>
    </footer>
  );
}
