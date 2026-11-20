'use client';

import { useState } from 'react';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel } from '@/components/ui';

const BOOKMARKS = [
  { label: 'Google',      icon: '🔍', url: 'https://google.com' },
  { label: 'YouTube',     icon: '▶️',  url: 'https://youtube.com' },
  { label: 'GitHub',      icon: '💻', url: 'https://github.com' },
  { label: 'X / Twitter', icon: '✖️',  url: 'https://x.com' },
  { label: 'Reddit',      icon: '🔶', url: 'https://reddit.com' },
  { label: 'Instagram',   icon: '📸', url: 'https://instagram.com' },
];

const BLOCKED_DOMAINS = ['google.com','youtube.com','x.com','twitter.com','instagram.com','reddit.com','facebook.com','linkedin.com','tiktok.com','amazon.com'];
const isBlockedUrl = (url: string) => BLOCKED_DOMAINS.some(d => url.includes(d));

function BrowserApp() {
  const [input, setInput] = useState('');
  const [frameUrl, setFrameUrl] = useState('');
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const accent = 'var(--beacon)';

  const navigate = (href: string) => {
    const url = href.trim();
    if (!url) return;
    const full = url.startsWith('http') ? url : url.includes('.') ? `https://${url}` : `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    if (isBlockedUrl(full)) {
      window.open(full, '_blank', 'noopener,noreferrer');
      return;
    }
    setBlocked(false);
    setLoading(true);
    setFrameUrl(full);
    setInput(full);
  };

  const openExternal = () => window.open(frameUrl, '_blank', 'noopener,noreferrer');

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:0 }}>
      <div style={{ display:'flex', gap:8, marginBottom:16 }}>
        {frameUrl && (
          <button onClick={() => { setFrameUrl(''); setInput(''); setBlocked(false); setLoading(false); }}
            title="Home"
            style={{ background:'var(--ink-2)', border:'1px solid var(--iron)', borderRadius:3, padding:'0 12px', color:'var(--paper)', fontSize:16, cursor:'pointer', flexShrink:0 }}>
            🏠
          </button>
        )}
        <div style={{ flex:1, display:'flex', alignItems:'center', background:'var(--ink-2)', border:`1px solid ${frameUrl ? accent : 'var(--iron)'}`, borderRadius:3, padding:'0 12px', gap:8 }}>
          <span style={{ fontSize:12, color: frameUrl ? accent : 'var(--ash)', flexShrink:0 }}>🔒</span>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && navigate(input)}
            placeholder="Search or enter a web address"
            style={{ flex:1, background:'none', border:'none', color:'var(--paper)', fontSize:13, outline:'none', fontFamily:'inherit', padding:'10px 0' }} />
          {frameUrl && (
            <button onClick={openExternal} title="Open in new tab"
              style={{ background:'none', border:'none', color:'var(--ash)', fontSize:14, cursor:'pointer', padding:'2px 4px', flexShrink:0 }}>
              ↗
            </button>
          )}
        </div>
        <button onClick={() => navigate(input)} style={{ background:accent, color:'#15130f', border:'none', borderRadius:3, padding:'0 16px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit', whiteSpace:'nowrap', flexShrink:0 }}>
          Go
        </button>
      </div>

      {frameUrl ? (
        blocked ? (
          <Panel style={{ padding:'40px 24px', textAlign:'center', display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
            <div style={{ fontSize:36 }}>🧭</div>
            <div style={{ fontSize:15, fontWeight:700, color:'var(--paper)' }}>This page can&apos;t be embedded</div>
            <div style={{ fontSize:13, color:'var(--ash)', maxWidth:'34ch', lineHeight:1.55 }}>
              The site refused to load in the frame. Open it in a real browser tab instead.
            </div>
            <button onClick={openExternal}
              style={{ background:accent, color:'#15130f', border:'none', borderRadius:3, padding:'10px 22px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              ↗ Open {frameUrl.replace(/^https?:\/\//, '').split('/')[0]}
            </button>
          </Panel>
        ) : (
          <div style={{ position:'relative', borderRadius:3, overflow:'hidden', border:'1px solid var(--iron)' }}>
            {loading && (
              <div style={{ position:'absolute', inset:0, background:'rgba(21,19,15,.7)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12, zIndex:2 }}>
                <div style={{ width:28, height:28, borderRadius:'50%', border:'3px solid var(--iron)', borderTopColor:accent, animation:'browserSpin 0.7s linear infinite' }} />
                <span style={{ fontSize:13, color:'var(--ash)' }}>Loading…</span>
              </div>
            )}
            <iframe
              key={frameUrl}
              src={frameUrl}
              style={{ width:'100%', height:420, border:'none', display:'block', background:'#fff' }}
              allow="fullscreen"
              title="browser"
              onLoad={() => setLoading(false)}
              onError={() => { setLoading(false); setBlocked(true); }}
            />
            <div style={{ position:'absolute', bottom:10, right:10, display:'flex', gap:6 }}>
              <button onClick={() => setBlocked(true)}
                style={{ background:'var(--ink-2)', border:'1px solid var(--iron)', borderRadius:3, color:'var(--ash)', fontSize:11, fontWeight:600, padding:'5px 10px', cursor:'pointer', fontFamily:'inherit' }}>
                Not loading?
              </button>
              <button onClick={openExternal}
                style={{ background:'var(--ink-2)', border:`1px solid ${accent}`, borderRadius:3, color:'var(--paper)', fontSize:11, fontWeight:600, padding:'5px 10px', cursor:'pointer', fontFamily:'inherit', display:'flex', alignItems:'center', gap:4 }}>
                ↗ New tab
              </button>
            </div>
          </div>
        )
      ) : (
        <>
          <p style={{ fontSize:12, color:'var(--ash)', fontWeight:600, marginBottom:12 }}>Favourites</p>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10 }}>
            {BOOKMARKS.map(bm => (
              <button key={bm.url} onClick={() => navigate(bm.url)}
                style={{ background:'var(--ink-2)', border:'1px solid var(--iron)', borderRadius:3, padding:'14px 8px', display:'flex', flexDirection:'column', alignItems:'center', gap:6, cursor:'pointer', fontFamily:'inherit' }}>
                <span style={{ fontSize:22 }}>{bm.icon}</span>
                <span style={{ fontSize:11.5, color:'var(--ash)', fontWeight:500 }}>{bm.label}</span>
              </button>
            ))}
          </div>
          <p style={{ fontSize:11, color:'var(--ash)', marginTop:14, lineHeight:1.55 }}>
            Most major sites (Google, YouTube, Reddit) open in a new browser tab automatically.
          </p>
        </>
      )}
      <style>{`@keyframes browserSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function BrowserView() {
  const { c } = useContent();
  return (
    <PageShell>
      <PageHeading kicker={c('browser.kicker')} heading={c('browser.heading')} subheading={c('browser.subheading')} />
      <BrowserApp />
    </PageShell>
  );
}
