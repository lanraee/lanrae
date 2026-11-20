'use client';

import { useEffect, useRef, useState } from 'react';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Mono } from '@/components/ui';

function SnakeGame() {
  const GRID = 20, CELL = 18, SPEED = 130;
  const gs = useRef({
    snake: [[5,10],[5,9],[5,8]] as number[][],
    food: [10,15] as number[],
    dir: [0,1] as [number,number],
    score: 0,
    best: 0,
    running: false,
  });
  const [, redraw] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const rnd = (sn: number[][]) => {
    let f: number[];
    do { f = [~~(Math.random()*GRID), ~~(Math.random()*GRID)]; }
    while (sn.some(s => s[0]===f[0] && s[1]===f[1]));
    return f;
  };

  const tick = () => {
    const g = gs.current;
    if (!g.running) return;
    const [dr,dc] = g.dir;
    const nh = [(g.snake[0][0]+dr+GRID)%GRID, (g.snake[0][1]+dc+GRID)%GRID];
    if (g.snake.some(s => s[0]===nh[0] && s[1]===nh[1])) {
      g.running = false;
      if (g.score > g.best) g.best = g.score;
      redraw(n => n+1);
      return;
    }
    const ate = nh[0]===g.food[0] && nh[1]===g.food[1];
    g.snake = ate ? [nh,...g.snake] : [nh,...g.snake.slice(0,-1)];
    if (ate) { g.score += 10; g.food = rnd(g.snake); }
    redraw(n => n+1);
  };

  const start = () => {
    const g = gs.current;
    const initSnake = [[5,10],[5,9],[5,8]];
    if (g.score > g.best) g.best = g.score;
    g.snake = initSnake; g.food = rnd(initSnake); g.dir = [0,1]; g.score = 0; g.running = true;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(tick, SPEED);
    redraw(n => n+1);
  };

  const steer = (dr: number, dc: number) => {
    const g = gs.current;
    if (dr !== -g.dir[0] || dc !== -g.dir[1]) g.dir = [dr, dc];
    if (!g.running) start();
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || (e.target as HTMLElement).isContentEditable) return;
      if (e.key==='ArrowUp'    || e.key==='w' || e.key==='W') { e.preventDefault(); steer(-1,0); }
      else if (e.key==='ArrowDown'  || e.key==='s' || e.key==='S') { e.preventDefault(); steer(1,0); }
      else if (e.key==='ArrowLeft'  || e.key==='a' || e.key==='A') { e.preventDefault(); steer(0,-1); }
      else if (e.key==='ArrowRight' || e.key==='d' || e.key==='D') { e.preventDefault(); steer(0,1); }
      else if (e.key===' ') { e.preventDefault(); if (!gs.current.running) start(); }
    };
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const g = gs.current;
  const W = GRID * CELL;
  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14, userSelect:'none', touchAction:'none' }}>
      <div style={{ width:W, display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--ash)' }}>
        <span>Score <Mono style={{ color:'var(--beacon)' }}>{g.score}</Mono></span>
        <span>Best <Mono style={{ color:'var(--paper)' }}>{g.best}</Mono></span>
      </div>
      <div style={{ position:'relative', width:W, height:W, background:'var(--ink-2)', borderRadius:3, border:'1px solid var(--iron)', overflow:'hidden' }}>
        {!g.running && (
          <div style={{ position:'absolute',inset:0, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:12 }}>
            {g.score > 0 && <div style={{ fontSize:13, color:'#e07a5f', fontWeight:700 }}>Game over</div>}
            <button onPointerDown={e => { e.preventDefault(); start(); }} style={{ background:'var(--beacon)', color:'#15130f', border:'none', borderRadius:3, padding:'10px 24px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'inherit' }}>
              {g.score > 0 ? '↺ Play again' : '▶ Start'}
            </button>
            {g.score === 0 && <div style={{ fontSize:11, color:'var(--ash)' }}>Arrow keys / WASD · tap buttons below</div>}
          </div>
        )}
        <div style={{ position:'absolute', left:g.food[1]*CELL+2, top:g.food[0]*CELL+2, width:CELL-4, height:CELL-4, background:'var(--beacon)', borderRadius:'50%' }} />
        {g.snake.map((seg,i) => (
          <div key={i} style={{ position:'absolute', left:seg[1]*CELL+1, top:seg[0]*CELL+1, width:CELL-2, height:CELL-2, background:i===0?'var(--paper)':`rgba(237,232,220,${Math.max(.25,1-i*.06)})`, borderRadius:i===0?3:2 }} />
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateAreas:'". up ." "left down right"', gridTemplateColumns:'repeat(3,66px)', gridTemplateRows:'66px 66px', gap:6, marginTop:4 }}>
        {([['up','▲',[-1,0]],['left','◀',[0,-1]],['down','▼',[1,0]],['right','▶',[0,1]]] as [string,string,[number,number]][]).map(([area,lbl,d]) => (
          <button
            key={area}
            onPointerDown={e => { e.preventDefault(); steer(d[0],d[1]); }}
            style={{
              gridArea: area, background: 'var(--ink-2)', border: '1px solid var(--iron)', borderRadius: 3,
              color: 'var(--paper)', fontSize: 22, fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'inherit',
              WebkitTapHighlightColor: 'transparent', touchAction: 'none',
            }}
          >
            {lbl}
          </button>
        ))}
      </div>
    </div>
  );
}

export function PlayView() {
  const { c } = useContent();
  return (
    <PageShell>
      <PageHeading kicker={c('play.kicker')} heading={c('play.heading')} subheading={c('play.subheading')} />
      <SnakeGame />
    </PageShell>
  );
}
