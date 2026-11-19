'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useContent } from '@/lib/useContent';
import { PageShell, Mono, Button } from '@/components/ui';

export function AboutView() {
  const { c } = useContent();
  const [productCount, setProductCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setProductCount(d.length);
    }).catch(() => {});
  }, []);

  return (
    <PageShell>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
        <Image src="/logo.png" alt="lanrae" width={36} height={36} style={{ borderRadius: 6 }} />
        {productCount !== null && (
          <Mono style={{ fontSize: 13, color: 'var(--beacon)' }}>{productCount} products shipped</Mono>
        )}
      </div>

      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 42px)',
        lineHeight: 1.15, letterSpacing: '-.01em', margin: '0 0 20px', color: 'var(--paper)', maxWidth: '20ch',
      }}>
        {c('about.heading') || 'lanrae · SI Product Engineer'}
      </h1>

      <p style={{ fontSize: 17, color: 'var(--ash)', maxWidth: '58ch', lineHeight: 1.65 }}>
        {c('about.body')}
      </p>

      <div style={{ display: 'flex', gap: 12, marginTop: 36, flexWrap: 'wrap' }}>
        <Link href="/store" style={{ textDecoration: 'none' }}><Button variant="primary">Browse the store</Button></Link>
        <Link href="/members" style={{ textDecoration: 'none' }}><Button variant="secondary">Join as a member</Button></Link>
      </div>
    </PageShell>
  );
}
