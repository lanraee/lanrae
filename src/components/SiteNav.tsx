'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useContent } from '@/lib/useContent';

export function SiteNav() {
  const { c } = useContent();
  const pathname = usePathname();
  const [moreOpen, setMoreOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const PRIMARY: { href: string; label: string; desc?: string }[] = [
    { href: '/store', label: c('nav.store.label') },
    { href: '/members', label: c('nav.members.label') },
    { href: '/blog', label: c('nav.blog.label') },
  ];

  const MORE = [
    { href: '/fans', label: c('nav.fans.label'), desc: c('nav.fans.desc') },
    { href: '/request', label: c('nav.request.label'), desc: c('nav.request.desc') },
    { href: '/support', label: c('nav.support.label'), desc: c('nav.support.desc') },
    { href: '/about', label: c('nav.about.label'), desc: c('nav.about.desc') },
    { href: '/trove', label: c('nav.trove.label'), desc: c('nav.trove.desc') },
    { href: '/tools', label: c('nav.tools.label'), desc: c('nav.tools.desc') },
    { href: '/radio', label: c('nav.radio.label'), desc: c('nav.radio.desc') },
    { href: '/play', label: c('nav.play.label'), desc: c('nav.play.desc') },
    { href: '/browser', label: c('nav.browser.label'), desc: c('nav.browser.desc') },
  ];

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  useEffect(() => { setMoreOpen(false); setMobileOpen(false); }, [pathname]);

  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href));

  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 1000,
      background: 'rgba(21,19,15,.92)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--iron)',
      padding: '0 20px', height: 56,
      display: 'flex', alignItems: 'center', gap: 28,
      fontFamily: 'var(--font-body)',
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 9, textDecoration: 'none', flexShrink: 0 }}>
        <Image src={c('site.logoUrl') || '/logo.png'} alt="lanrae" width={26} height={26} style={{ borderRadius: 6 }} />
        <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--paper)', letterSpacing: '-.01em' }}>
          lanrae
        </span>
      </Link>

      {/* desktop nav */}
      <div className="nav-desktop" style={{ alignItems: 'center', gap: 22, flex: 1 }}>
        {PRIMARY.map(item => (
          <Link key={item.href} href={item.href} style={{
            fontSize: 14, textDecoration: 'none', fontWeight: 500,
            color: isActive(item.href) ? 'var(--paper)' : 'var(--ash)',
            borderBottom: isActive(item.href) ? '2px solid var(--beacon)' : '2px solid transparent',
            paddingBottom: 17, marginBottom: -17,
            transition: 'color .15s ease',
          }}>
            {item.label}
          </Link>
        ))}

        <div ref={moreRef} style={{ position: 'relative' }}>
          <button onClick={() => setMoreOpen(v => !v)} style={{
            fontSize: 14, fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer',
            color: moreOpen ? 'var(--paper)' : 'var(--ash)', padding: 0, fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', gap: 5,
          }}>
            More
            <span style={{ fontSize: 10, transform: moreOpen ? 'rotate(180deg)' : 'none', transition: 'transform .15s ease' }}>▾</span>
          </button>

          {moreOpen && (
            <div style={{
              position: 'absolute', top: 36, left: 0, width: 280,
              background: 'var(--ink-2)', border: '1px solid var(--iron)',
              boxShadow: '0 16px 40px rgba(0,0,0,.5)',
              padding: 6,
            }}>
              {MORE.map(item => (
                <Link key={item.href} href={item.href} style={{
                  display: 'block', padding: '9px 10px', textDecoration: 'none',
                  borderLeft: isActive(item.href) ? '2px solid var(--beacon)' : '2px solid transparent',
                }}>
                  <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--paper)' }}>{item.label}</div>
                  <div style={{ fontSize: 11.5, color: 'var(--ash)', marginTop: 1 }}>{item.desc}</div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ flex: 1 }} className="nav-mobile-spacer" />

      {/* mobile hamburger */}
      <button
        className="nav-hamburger"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        onClick={() => setMobileOpen(v => !v)}
        style={{
          width: 34, height: 34, flexShrink: 0, background: 'none', cursor: 'pointer',
          border: '1px solid var(--iron)', color: 'var(--paper)', fontSize: 16,
          alignItems: 'center', justifyContent: 'center',
        }}
      >
        {mobileOpen ? '✕' : '☰'}
      </button>

      <Link href="/profile" aria-label="Member profile" style={{
        width: 34, height: 34, display: 'grid', placeItems: 'center',
        border: '1px solid var(--iron)', color: isActive('/profile') ? 'var(--beacon)' : 'var(--ash)',
        textDecoration: 'none', flexShrink: 0, fontSize: 15,
      }}>
        ◈
      </Link>

      {/* mobile menu panel */}
      {mobileOpen && (
        <div className="nav-mobile-panel" style={{
          position: 'absolute', top: 56, left: 0, right: 0,
          background: 'var(--ink-2)', borderBottom: '1px solid var(--iron)',
          maxHeight: 'calc(100vh - 56px)', overflowY: 'auto',
          padding: 6,
        }}>
          {[...PRIMARY, ...MORE].map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'block', padding: '11px 12px', textDecoration: 'none',
              borderLeft: isActive(item.href) ? '2px solid var(--beacon)' : '2px solid transparent',
            }}>
              <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--paper)' }}>{item.label}</div>
              {item.desc && <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 1 }}>{item.desc}</div>}
            </Link>
          ))}
        </div>
      )}

      <style>{`
        .nav-desktop { display: flex; }
        .nav-hamburger { display: none; }
        .nav-mobile-spacer { display: none; }
        @media (max-width: 760px) {
          .nav-desktop { display: none; }
          .nav-hamburger { display: flex; }
          .nav-mobile-spacer { display: block; }
        }
      `}</style>
    </nav>
  );
}
