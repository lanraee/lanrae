'use client';

import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type VisitorToast = { id: string; city: string | null; country: string | null; browser: string | null; device: string | null };
type PaymentToast = { id: number; icon: string; text: string; sub: string };
type DemoToast = { id: number; flag: string; name: string; city: string; tier: string; tierIcon: string };

const DEMO_SUBSCRIBERS = [
  { flag: '🇳🇬', name: 'Emeka', city: 'Lagos' },
  { flag: '🇯🇵', name: 'Yuki', city: 'Tokyo' },
  { flag: '🇺🇸', name: 'Marcus', city: 'New York' },
  { flag: '🇬🇧', name: 'Charlotte', city: 'London' },
  { flag: '🇮🇳', name: 'Priya', city: 'Mumbai' },
  { flag: '🇦🇪', name: 'Omar', city: 'Dubai' },
  { flag: '🇧🇷', name: 'Isabella', city: 'São Paulo' },
  { flag: '🇩🇪', name: 'Lukas', city: 'Berlin' },
  { flag: '🇨🇦', name: 'Aisha', city: 'Toronto' },
  { flag: '🇰🇷', name: 'Min-jun', city: 'Seoul' },
  { flag: '🇿🇦', name: 'Lerato', city: 'Cape Town' },
  { flag: '🇸🇬', name: 'Mei Ling', city: 'Singapore' },
  { flag: '🇫🇷', name: 'Camille', city: 'Paris' },
  { flag: '🇦🇺', name: 'Liam', city: 'Sydney' },
  { flag: '🇲🇽', name: 'Diego', city: 'Mexico City' },
  { flag: '🇸🇪', name: 'Ingrid', city: 'Stockholm' },
  { flag: '🇰🇪', name: 'Amara', city: 'Nairobi' },
  { flag: '🇳🇱', name: 'Lars', city: 'Amsterdam' },
  { flag: '🇵🇭', name: 'Ana', city: 'Manila' },
  { flag: '🇹🇷', name: 'Zeynep', city: 'Istanbul' },
  { flag: '🇪🇬', name: 'Hassan', city: 'Cairo' },
  { flag: '🇨🇴', name: 'Valentina', city: 'Bogotá' },
  { flag: '🇬🇭', name: 'Kwame', city: 'Accra' },
  { flag: '🇵🇰', name: 'Zara', city: 'Karachi' },
  { flag: '🇮🇩', name: 'Arjuna', city: 'Jakarta' },
  { flag: '🇮🇹', name: 'Matteo', city: 'Milan' },
  { flag: '🇷🇺', name: 'Sasha', city: 'Moscow' },
  { flag: '🇦🇷', name: 'Luciana', city: 'Buenos Aires' },
  { flag: '🇿🇼', name: 'Chido', city: 'Harare' },
  { flag: '🇺🇦', name: 'Olena', city: 'Kyiv' },
];
const TIERS = [
  { tier: 'Supporter', tierIcon: '⭐' },
  { tier: 'Supporter', tierIcon: '⭐' },
  { tier: 'Insider', tierIcon: '🏆' },
  { tier: 'Supporter', tierIcon: '⭐' },
  { tier: 'Insider', tierIcon: '🏆' },
  { tier: 'Explorer', tierIcon: '🎉' },
];

function countryFlag(code: string | null) {
  if (!code || code.length !== 2) return '🌍';
  return code.toUpperCase().replace(/./g, ch => String.fromCodePoint(ch.charCodeAt(0) + 127397));
}

export function GlobalToasts() {
  const pathname = usePathname();
  const [toasts, setToasts] = useState<VisitorToast[]>([]);
  const [spToasts, setSpToasts] = useState<PaymentToast[]>([]);
  const [demoToast, setDemoToast] = useState<DemoToast | null>(null);
  const lastPoll = useRef(new Date().toISOString());
  const spSeen = useRef<Set<string>>(new Set());

  useEffect(() => {
    fetch('/api/analytics/track', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ path: pathname }) }).catch(() => {});
  }, [pathname]);

  useEffect(() => {
    const pollVisitors = async () => {
      try {
        const res = await fetch(`/api/analytics/visitors?since=${lastPoll.current}`);
        const views = await res.json();
        lastPoll.current = new Date().toISOString();
        if (Array.isArray(views) && views.length > 0) {
          const v = views[0];
          const id = v.id;
          setToasts(prev => [...prev.slice(-2), { id, city: v.city, country: v.country, browser: v.browser, device: v.device }]);
          setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 6000);
        }
      } catch {}
    };
    const timer = setInterval(pollVisitors, 15000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const poll = async () => {
      try {
        const res = await fetch('/api/social-proof');
        if (!res.ok) return;
        const { events } = await res.json();
        if (!Array.isArray(events)) return;
        events.forEach((e: { type: string; tier: string | null; product: string | null; minutesAgo: number; tierLevel: string | null }, idx: number) => {
          if (e.minutesAgo > 60) return;
          const key = `${e.type}-${e.tier}-${e.product}-${e.minutesAgo}`;
          if (spSeen.current.has(key)) return;
          spSeen.current.add(key);
          const id = Date.now() + idx;
          const isMembership = e.type === 'membership';
          const icon = isMembership
            ? (e.tierLevel === 'insider' ? '🏆' : e.tierLevel === 'supporter' ? '⭐' : '🎉')
            : '🛍️';
          const text = isMembership
            ? `New ${e.tier ?? 'member'} subscription`
            : `${e.product ?? 'Product'} just purchased`;
          const sub = e.minutesAgo === 0 ? 'just now' : `${e.minutesAgo}m ago`;
          setSpToasts(prev => [...prev.slice(-2), { id, icon, text, sub }]);
          setTimeout(() => setSpToasts(prev => prev.filter(t => t.id !== id)), 7000);
        });
      } catch {}
    };
    poll();
    const interval = setInterval(poll, 45000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const used = new Set<number>();
    let timeoutRef = 0 as unknown as ReturnType<typeof setTimeout>;
    const fire = () => {
      let idx: number;
      do { idx = Math.floor(Math.random() * DEMO_SUBSCRIBERS.length); } while (used.has(idx) && used.size < DEMO_SUBSCRIBERS.length);
      if (used.size >= DEMO_SUBSCRIBERS.length) used.clear();
      used.add(idx);
      const person = DEMO_SUBSCRIBERS[idx];
      const tierObj = TIERS[Math.floor(Math.random() * TIERS.length)];
      const id = Date.now();
      setDemoToast({ id, ...person, ...tierObj });
      setTimeout(() => setDemoToast(t => t?.id === id ? null : t), 6500);
      const next = 28000 + Math.random() * 52000;
      timeoutRef = setTimeout(fire, next);
    };
    const initial = 12000 + Math.random() * 18000;
    timeoutRef = setTimeout(fire, initial);
    return () => clearTimeout(timeoutRef);
  }, []);

  return (
    <>
      {demoToast && (
        <div key={demoToast.id} style={{
          position: 'fixed', bottom: 96, right: 16, zIndex: 1700,
          background: 'var(--ink-2)',
          border: '1px solid var(--iron)',
          borderLeft: '2px solid var(--beacon)',
          padding: '13px 16px',
          display: 'flex', alignItems: 'center', gap: 13,
          boxShadow: '0 12px 36px rgba(0,0,0,.45)',
          animation: 'toastRise .4s cubic-bezier(.2,.9,.3,1.1)',
          maxWidth: 270,
          pointerEvents: 'none',
          fontFamily: 'var(--font-body)',
        }}>
          <div style={{ fontSize: 28, lineHeight: 1, flexShrink: 0 }}>{demoToast.flag}</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--paper)', lineHeight: 1.35 }}>
              {demoToast.name} from {demoToast.city}
            </div>
            <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 2 }}>
              {demoToast.tierIcon} just joined <span style={{ color: 'var(--beacon)', fontWeight: 600 }}>{demoToast.tier}</span>
            </div>
            <div style={{ fontSize: 11, color: '#7fbf7f', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#7fbf7f', display: 'inline-block' }} />
              Verified · just now
            </div>
          </div>
        </div>
      )}

      {spToasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: 160, left: 16, zIndex: 1600,
          display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
          {spToasts.map(t => (
            <div key={t.id} style={{
              background: 'var(--ink-2)',
              border: '1px solid var(--iron)',
              borderLeft: '2px solid var(--beacon)',
              padding: '11px 16px',
              display: 'flex', alignItems: 'center', gap: 12,
              fontSize: 13, color: 'var(--paper)',
              boxShadow: '0 8px 28px rgba(0,0,0,.4)',
              animation: 'toastRise .35s cubic-bezier(.2,.9,.3,1.1)',
              minWidth: 230,
              fontFamily: 'var(--font-body)',
            }}>
              <div style={{ fontSize: 18, flexShrink: 0 }}>{t.icon}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, lineHeight: 1.3 }}>{t.text}</div>
                <div style={{ fontSize: 11, color: 'var(--beacon)', marginTop: 2, fontWeight: 500 }}>✓ Verified · {t.sub}</div>
              </div>
            </div>
          ))}
        </div>
      )}

      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: 88, left: 16, zIndex: 1500,
          display: 'flex', flexDirection: 'column', gap: 8, pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div key={t.id} style={{
              background: 'var(--ink-2)', border: '1px solid var(--iron)',
              padding: '10px 14px', display: 'flex', alignItems: 'center', gap: 10,
              fontSize: 13, color: 'var(--paper)', boxShadow: '0 8px 24px rgba(0,0,0,.4)',
              animation: 'toastRise .35s cubic-bezier(.2,.9,.3,1.1)',
              fontFamily: 'var(--font-body)',
            }}>
              <span style={{ fontSize: 16 }}>{countryFlag(t.country)}</span>
              <div>
                <div style={{ fontWeight: 600, fontSize: 12 }}>
                  {t.city && t.country ? `${t.city}, ${t.country}` : t.country || 'Unknown location'}
                </div>
                <div style={{ fontSize: 11, color: 'var(--ash)', marginTop: 1 }}>
                  {[t.browser, t.device].filter(Boolean).join(' · ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`@keyframes toastRise { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </>
  );
}
