'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useContent } from '@/lib/useContent';
import { PageShell, Panel, Row, Mono, Button } from '@/components/ui';
import { HeroSlider, type HeroSlide } from '@/components/HeroSlider';

type Counts = { products: number | null; minTierPrice: number | null; fans: number | null };
type Post = { id: string; title: string; slug: string; excerpt: string | null; category: string; icon: string | null };

export function HomeView() {
  const { c } = useContent();
  const [counts, setCounts] = useState<Counts>({ products: null, minTierPrice: null, fans: null });
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setCounts(c => ({ ...c, products: d.length }));
    }).catch(() => {});
    fetch('/api/memberships').then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.length) {
        const min = Math.min(...d.map((t: { price: number }) => t.price));
        setCounts(c => ({ ...c, minTierPrice: min }));
      }
    }).catch(() => {});
    fetch('/api/fans').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setCounts(c => ({ ...c, fans: d.length }));
    }).catch(() => {});
    fetch('/api/posts').then(r => r.json()).then(d => {
      if (Array.isArray(d)) setPosts(d.slice(0, 3));
    }).catch(() => {});
  }, []);

  let heroSlides: HeroSlide[] = [];
  try {
    const parsed = JSON.parse(c('home.hero.slides') || '[]');
    if (Array.isArray(parsed)) heroSlides = parsed;
  } catch {}

  const MANIFEST = [
    { href: '/store', label: c('nav.store.label'), desc: c('home.manifest.store.desc'), key: 'products' as const },
    { href: '/members', label: c('nav.members.label'), desc: c('home.manifest.members.desc'), key: 'members' as const },
    { href: '/fans', label: c('nav.fans.label'), desc: c('home.manifest.fans.desc'), key: 'fans' as const },
    { href: '/request', label: c('nav.request.label'), desc: c('home.manifest.request.desc'), key: null },
    { href: '/support', label: c('nav.support.label'), desc: c('home.manifest.support.desc'), key: null },
    { href: '/about', label: c('nav.about.label'), desc: c('home.manifest.about.desc'), key: null },
  ];

  const ALSO_HERE = [
    { href: '/trove', label: c('nav.trove.label') },
    { href: '/tools', label: c('nav.tools.label') },
    { href: '/radio', label: c('nav.radio.label') },
    { href: '/play', label: c('nav.play.label') },
    { href: '/browser', label: c('nav.browser.label') },
  ];

  const figureFor = (key: typeof MANIFEST[number]['key']) => {
    if (key === 'products' && counts.products !== null) return `${counts.products} shipped`;
    if (key === 'members' && counts.minTierPrice !== null) return counts.minTierPrice === 0 ? 'from free' : `from £${(counts.minTierPrice / 100).toFixed(0)}`;
    if (key === 'fans' && counts.fans !== null) return `${counts.fans} on the board`;
    return null;
  };

  return (
    <PageShell>
      <HeroSlider slides={heroSlides} />

      {/* hero */}
      <section style={{ marginBottom: 56 }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(34px, 6vw, 58px)',
          lineHeight: 1.08, letterSpacing: '-.015em', margin: 0, color: 'var(--paper)', maxWidth: '16ch',
        }}>
          {c('home.hero.heading')}
        </h1>
        <p style={{ fontSize: 17, color: 'var(--ash)', marginTop: 18, maxWidth: '56ch', lineHeight: 1.6 }}>
          {c('home.hero.body')}
        </p>
        <div style={{ display: 'flex', gap: 12, marginTop: 28, flexWrap: 'wrap' }}>
          <Link href="/store" style={{ textDecoration: 'none' }}><Button variant="primary">{c('home.hero.cta1')}</Button></Link>
          <Link href="/blog" style={{ textDecoration: 'none' }}><Button variant="secondary">{c('home.hero.cta2')}</Button></Link>
        </div>
      </section>

      {/* manifest */}
      <section style={{ marginBottom: 64 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--paper)', margin: 0 }}>
            {c('home.manifest.heading')}
          </h2>
          <span style={{ fontSize: 12, color: 'var(--ash)', fontFamily: 'var(--font-mono)' }}>updated live</span>
        </div>
        <Panel style={{ padding: 0 }}>
          {MANIFEST.map((row, i) => {
            const figure = figureFor(row.key);
            return (
              <Link key={row.href} href={row.href} style={{ textDecoration: 'none', color: 'inherit' }}>
                <Row style={{
                  padding: '18px 20px',
                  borderBottom: i === MANIFEST.length - 1 ? 'none' : '1px solid var(--iron-soft)',
                }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--paper)', fontFamily: 'var(--font-display)' }}>{row.label}</div>
                    <div style={{ fontSize: 13.5, color: 'var(--ash)', marginTop: 3 }}>{row.desc}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0 }}>
                    {figure && <Mono style={{ fontSize: 13, color: 'var(--beacon)' }}>{figure}</Mono>}
                    <span style={{ color: 'var(--ash)', fontSize: 15 }}>→</span>
                  </div>
                </Row>
              </Link>
            );
          })}
        </Panel>

        <div style={{ marginTop: 16, display: 'flex', gap: 18, flexWrap: 'wrap', fontSize: 13 }}>
          <span style={{ color: 'var(--ash)' }}>{c('home.alsohere.label')}</span>
          {ALSO_HERE.map(l => (
            <Link key={l.href} href={l.href} style={{ color: 'var(--paper)', textDecoration: 'none', borderBottom: '1px solid var(--iron)' }}>
              {l.label}
            </Link>
          ))}
        </div>
      </section>

      {/* latest from the blog */}
      {posts.length > 0 && (
        <section>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 16 }}>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--paper)', margin: 0 }}>
              {c('home.blog.heading')}
            </h2>
            <Link href="/blog" style={{ fontSize: 13, color: 'var(--ash)', textDecoration: 'none' }}>View all →</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 14 }}>
            {posts.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none' }}>
                <Panel style={{ height: '100%' }}>
                  <div style={{ fontSize: 20, marginBottom: 10 }}>{post.icon || '📝'}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ash)', marginBottom: 6, textTransform: 'capitalize' }}>{post.category}</div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--paper)', fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>{post.title}</div>
                  {post.excerpt && (
                    <div style={{ fontSize: 13, color: 'var(--ash)', marginTop: 8, lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.excerpt}
                    </div>
                  )}
                </Panel>
              </Link>
            ))}
          </div>
        </section>
      )}
    </PageShell>
  );
}
