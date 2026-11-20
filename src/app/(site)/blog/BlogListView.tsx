'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useContent } from '@/lib/useContent';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  category: string;
  tags: string[];
  publishedAt: string | null;
  readTime: number | null;
  icon: string | null;
  gradient: string;
};

const CATEGORIES = ['all', 'tutorial', 'devlog', 'guide', 'video'];

export function BlogListView() {
  const { c } = useContent();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetch('/api/posts')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPosts(d); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p => {
    const matchCat = filter === 'all' || p.category === filter;
    const q = search.toLowerCase();
    const matchSearch = !q || p.title.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)) || p.excerpt?.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-body)' }}>
      {/* hero */}
      <div style={{ padding: '56px 24px 36px', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ fontSize: 13.5, color: 'var(--ash)', marginBottom: 12, fontWeight: 500 }}>{c('blog.kicker')}</div>
        <h1 style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 5vw, 44px)', lineHeight: 1.15, marginBottom: 14, color: 'var(--paper)' }}>
          {c('blog.heading')}
        </h1>
        <p style={{ fontSize: 16, color: 'var(--ash)', maxWidth: '52ch', lineHeight: 1.6 }}>
          {c('blog.subheading')}
        </p>
      </div>

      {/* filters */}
      <div style={{ padding: '0 24px 28px', maxWidth: 1040, margin: '0 auto' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          {CATEGORIES.map(cat => (
            <button key={cat} onClick={() => setFilter(cat)}
              style={{ padding: '7px 14px', borderRadius: 3, fontSize: 13, fontWeight: 600,
                cursor: 'pointer', border: '1px solid var(--iron)', transition: 'all .15s ease',
                background: filter === cat ? 'var(--beacon)' : 'transparent',
                color: filter === cat ? 'var(--ink)' : 'var(--ash)', fontFamily: 'inherit' }}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
          <input
            placeholder="Search posts…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ marginLeft: 'auto', background: 'var(--ink-2)', border: '1px solid var(--iron)',
              borderRadius: 3, padding: '7px 14px', fontSize: 13, color: 'var(--paper)',
              fontFamily: 'inherit', outline: 'none', width: 200 }}
          />
        </div>
      </div>

      {/* posts grid */}
      <div style={{ padding: '0 24px 80px', maxWidth: 1040, margin: '0 auto' }}>
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {[1,2,3].map(i => (
              <div key={i} style={{ height: 220, borderRadius: 3, background: 'var(--ink-2)',
                border: '1px solid var(--iron)', animation: 'blogPulse 1.5s ease infinite' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--ash)' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <p style={{ fontSize: 15 }}>{search || filter !== 'all' ? 'No posts match your search.' : 'No posts published yet — check back soon.'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 16 }}>
            {filtered.map(post => (
              <Link key={post.id} href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <article style={{ background: 'var(--ink-2)', border: '1px solid var(--iron)',
                  borderRadius: 3, overflow: 'hidden', display: 'flex', flexDirection: 'column',
                  transition: 'border-color .15s ease', cursor: 'pointer', height: '100%' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--beacon)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--iron)'; }}>

                  {/* card header */}
                  <div style={{ height: 96, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 36, background: post.gradient, position: 'relative', borderBottom: '1px solid var(--iron)' }}>
                    {post.icon || '📝'}
                    <span style={{ position: 'absolute', top: 10, left: 10, fontSize: 10,
                      fontWeight: 600, padding: '3px 8px', background: 'rgba(0,0,0,.4)',
                      border: '1px solid rgba(255,255,255,.15)', color: '#ede8dc' }}>
                      {post.category}
                    </span>
                  </div>

                  {/* card body */}
                  <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: 8, flex: 1 }}>
                    <h2 style={{ fontSize: 15, fontWeight: 600, lineHeight: 1.35, margin: 0, fontFamily: 'var(--font-display)', color: 'var(--paper)' }}>{post.title}</h2>
                    {post.excerpt && (
                      <p style={{ fontSize: 12.5, color: 'var(--ash)', lineHeight: 1.5, margin: 0,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {post.excerpt}
                      </p>
                    )}
                    {post.tags.length > 0 && (
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 'auto', paddingTop: 4 }}>
                        {post.tags.slice(0, 3).map(tag => (
                          <span key={tag} style={{ fontSize: 10.5, padding: '2px 8px',
                            border: '1px solid var(--iron)',
                            color: 'var(--beacon)', fontWeight: 600 }}>
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4,
                      fontSize: 11.5, color: 'var(--ash)' }}>
                      {post.publishedAt && <span>{fmt(post.publishedAt)}</span>}
                      {post.readTime && <><span>·</span><span>{post.readTime} min read</span></>}
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>

      <style>{`@keyframes blogPulse { 0%, 100% { opacity: .5 } 50% { opacity: 1 } }`}</style>
    </div>
  );
}
