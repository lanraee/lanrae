'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Post = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  category: string;
  tags: string[];
  publishedAt: string | null;
  readTime: number | null;
  icon: string | null;
  gradient: string;
};

export function PostView() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/posts/${slug}`)
      .then(r => { if (!r.ok) throw new Error('not found'); return r.json(); })
      .then(setPost)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  const fmt = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ink)', color: 'var(--paper)', fontFamily: 'var(--font-body)' }}>
      {loading && (
        <div style={{ maxWidth: 740, margin: '80px auto', padding: '0 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[80, 40, 100, 60, 100].map((w, i) => (
            <div key={i} style={{ height: 18, width: `${w}%`,
              background: 'var(--ink-2)', animation: 'postPulse 1.5s ease infinite' }} />
          ))}
        </div>
      )}

      {notFound && (
        <div style={{ textAlign: 'center', padding: '120px 24px', color: 'var(--ash)' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>404</div>
          <p style={{ fontSize: 16, marginBottom: 24 }}>Post not found.</p>
          <Link href="/blog" style={{ color: 'var(--beacon)', textDecoration: 'none', fontWeight: 600 }}>← Back to blog</Link>
        </div>
      )}

      {post && (
        <>
          {/* hero */}
          <div style={{ height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 56, background: post.gradient, position: 'relative', borderBottom: '4px solid var(--beacon)' }}>
            {post.icon || '📝'}
          </div>

          {/* article */}
          <article style={{ maxWidth: 740, margin: '0 auto', padding: '0 24px 100px' }}>

            {/* meta */}
            <div style={{ padding: '32px 0 24px', borderBottom: '1px solid var(--iron)' }}>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14, flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 600,
                  padding: '3px 10px', border: '1px solid var(--beacon)', color: 'var(--beacon)' }}>
                  {post.category}
                </span>
                {post.tags.map(tag => (
                  <span key={tag} style={{ fontSize: 11, padding: '3px 10px',
                    border: '1px solid var(--iron)', color: 'var(--ash)', fontWeight: 600 }}>
                    #{tag}
                  </span>
                ))}
              </div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(22px, 4vw, 34px)', fontWeight: 600, lineHeight: 1.2,
                marginBottom: 12, letterSpacing: '-.01em', color: 'var(--paper)' }}>
                {post.title}
              </h1>
              {post.excerpt && (
                <p style={{ fontSize: 16, color: 'var(--ash)', lineHeight: 1.6, marginBottom: 16 }}>{post.excerpt}</p>
              )}
              <div style={{ display: 'flex', gap: 14, fontSize: 13, color: 'var(--ash)' }}>
                {post.publishedAt && <span>{fmt(post.publishedAt)}</span>}
                {post.readTime && <span>· {post.readTime} min read</span>}
                <Link href="/blog" style={{ marginLeft: 'auto', color: 'var(--beacon)', textDecoration: 'none', fontSize: 13 }}>
                  ← All posts
                </Link>
              </div>
            </div>

            {/* markdown content */}
            <div className="prose-lanrae" style={{ paddingTop: 36 }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 600, marginTop: 40, marginBottom: 16, color: 'var(--paper)' }}>{children}</h1>,
                  h2: ({ children }) => <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 600, marginTop: 36, marginBottom: 12, color: 'var(--paper)', borderBottom: '1px solid var(--iron)', paddingBottom: 8 }}>{children}</h2>,
                  h3: ({ children }) => <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 600, marginTop: 28, marginBottom: 10, color: 'var(--paper)' }}>{children}</h3>,
                  p: ({ children }) => <p style={{ fontSize: 15, lineHeight: 1.75, color: 'var(--paper)', marginBottom: 16 }}>{children}</p>,
                  code: ({ children, className }) => {
                    const isBlock = !!className;
                    return isBlock
                      ? <code style={{ display: 'block', background: 'var(--ink-2)', border: '1px solid var(--iron)', padding: '16px 18px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--beacon)', lineHeight: 1.65, overflowX: 'auto', whiteSpace: 'pre' }}>{children}</code>
                      : <code style={{ background: 'var(--ink-2)', border: '1px solid var(--iron)', padding: '2px 7px', fontSize: 13, fontFamily: 'var(--font-mono)', color: 'var(--beacon)' }}>{children}</code>;
                  },
                  pre: ({ children }) => <pre style={{ margin: '20px 0', overflow: 'hidden' }}>{children}</pre>,
                  ul: ({ children }) => <ul style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</ul>,
                  ol: ({ children }) => <ol style={{ paddingLeft: 20, marginBottom: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>{children}</ol>,
                  li: ({ children }) => <li style={{ fontSize: 15, lineHeight: 1.6, color: 'var(--paper)' }}>{children}</li>,
                  blockquote: ({ children }) => <blockquote style={{ borderLeft: '2px solid var(--beacon)', paddingLeft: 16, margin: '20px 0', color: 'var(--ash)', fontStyle: 'italic' }}>{children}</blockquote>,
                  table: ({ children }) => <div style={{ overflowX: 'auto', marginBottom: 20 }}><table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>{children}</table></div>,
                  th: ({ children }) => <th style={{ padding: '10px 14px', background: 'var(--ink-2)', border: '1px solid var(--iron)', textAlign: 'left', fontWeight: 600, fontSize: 12, color: 'var(--beacon)' }}>{children}</th>,
                  td: ({ children }) => <td style={{ padding: '10px 14px', border: '1px solid var(--iron)', color: 'var(--paper)', fontSize: 14 }}>{children}</td>,
                  a: ({ children, href }) => <a href={href} style={{ color: 'var(--beacon)', textDecoration: 'underline', textUnderlineOffset: 3 }}>{children}</a>,
                  strong: ({ children }) => <strong style={{ fontWeight: 700, color: 'var(--paper)' }}>{children}</strong>,
                  hr: () => <hr style={{ border: 'none', borderTop: '1px solid var(--iron)', margin: '36px 0' }} />,
                }}
              >
                {post.content}
              </ReactMarkdown>
            </div>

            {/* footer nav */}
            <div style={{ marginTop: 60, paddingTop: 24, borderTop: '1px solid var(--iron)',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Link href="/blog" style={{ color: 'var(--beacon)', textDecoration: 'none', fontSize: 14, fontWeight: 600 }}>
                ← Back to blog
              </Link>
              <Link href="/" style={{ color: 'var(--ash)', textDecoration: 'none', fontSize: 13 }}>
                lanrae.co.uk
              </Link>
            </div>
          </article>
        </>
      )}

      <style>{`@keyframes postPulse { 0%, 100% { opacity: .4 } 50% { opacity: .8 } }`}</style>
    </div>
  );
}
