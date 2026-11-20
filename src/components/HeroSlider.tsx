'use client';

import { useEffect, useRef, useState } from 'react';

export type HeroSlide = { url: string; caption?: string };

export function HeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const valid = slides.filter(s => s.url?.trim());
  const safeIndex = valid.length > 0 ? index % valid.length : 0;

  useEffect(() => {
    if (valid.length <= 1 || paused) return;
    timerRef.current = setInterval(() => {
      setIndex(i => (i + 1) % valid.length);
    }, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [valid.length, paused]);

  if (valid.length === 0) return null;

  const go = (i: number) => setIndex((i + valid.length) % valid.length);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        position: 'relative', width: '100%',
        aspectRatio: '16 / 7', maxHeight: 420,
        overflow: 'hidden', border: '1px solid var(--iron)',
        background: 'var(--ink-2)', marginBottom: 40,
      }}
    >
      {valid.map((s, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          opacity: i === safeIndex ? 1 : 0,
          transition: 'opacity .5s ease',
          pointerEvents: i === safeIndex ? 'auto' : 'none',
        }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={s.url} alt={s.caption || ''} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          {s.caption && (
            <div style={{
              position: 'absolute', left: 0, right: 0, bottom: 0,
              padding: '28px 24px 18px',
              background: 'linear-gradient(to top, rgba(0,0,0,.75), transparent)',
              color: 'var(--paper)', fontSize: 15, fontWeight: 500,
            }}>
              {s.caption}
            </div>
          )}
        </div>
      ))}

      {valid.length > 1 && (
        <>
          <button
            aria-label="Previous slide"
            onClick={() => go(safeIndex - 1)}
            style={navBtnStyle('left')}
          >‹</button>
          <button
            aria-label="Next slide"
            onClick={() => go(safeIndex + 1)}
            style={navBtnStyle('right')}
          >›</button>

          <div style={{
            position: 'absolute', bottom: 12, left: 0, right: 0,
            display: 'flex', justifyContent: 'center', gap: 7,
          }}>
            {valid.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => go(i)}
                style={{
                  width: i === safeIndex ? 18 : 7, height: 7, borderRadius: 4,
                  border: 'none', cursor: 'pointer', padding: 0,
                  background: i === safeIndex ? 'var(--beacon)' : 'rgba(255,255,255,.4)',
                  transition: 'width .2s ease, background .2s ease',
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function navBtnStyle(side: 'left' | 'right'): React.CSSProperties {
  return {
    position: 'absolute', top: '50%', [side]: 10, transform: 'translateY(-50%)',
    width: 36, height: 36, borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'rgba(21,19,15,.55)', color: '#ede8dc', fontSize: 20, lineHeight: 1,
    display: 'grid', placeItems: 'center',
  };
}
