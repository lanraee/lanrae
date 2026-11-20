'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useContent } from '@/lib/useContent';
import { PageShell, Kicker, Panel } from '@/components/ui';

type TierInfo = { tier: string; tierName: string; limit: number | null; loggedIn: boolean };

function getUsed(tier: string): number {
  try {
    if (tier === 'supporter') {
      const raw = localStorage.getItem('ta_sup');
      if (!raw) return 0;
      const { n, d } = JSON.parse(raw);
      return d === new Date().toISOString().slice(0, 10) ? n : 0;
    }
    return parseInt(localStorage.getItem('ta_free') || '0', 10);
  } catch { return 0; }
}

function incrementUsed(tier: string) {
  try {
    if (tier === 'supporter') {
      const today = new Date().toISOString().slice(0, 10);
      const n = getUsed('supporter');
      localStorage.setItem('ta_sup', JSON.stringify({ n: n + 1, d: today }));
    } else if (tier === 'free') {
      localStorage.setItem('ta_free', String(getUsed('free') + 1));
    }
  } catch {}
}

function renderBlocks(text: string, mono = false) {
  const parts = text.split(/(```[\s\S]*?```)/g);
  return parts.map((part, i) => {
    if (part.startsWith('```')) {
      const code = part.replace(/^```\w*\n?/, '').replace(/\n?```$/, '');
      return (
        <pre key={i} style={{
          background: 'var(--ink)', border: '1px solid var(--iron)',
          borderRadius: 3, padding: '10px 12px', margin: '6px 0',
          fontFamily: 'var(--font-mono)', fontSize: 12, color: 'var(--beacon)',
          overflowX: 'auto', whiteSpace: 'pre',
        }}>{code}</pre>
      );
    }
    return <span key={i} style={{ whiteSpace: 'pre-wrap', fontFamily: mono ? 'var(--font-mono)' : 'inherit' }}>{part}</span>;
  });
}

export function TroveAgentView() {
  const { c } = useContent();
  const [tab, setTab] = useState<'chat' | 'terminal'>('chat');
  const [chatMsgs, setChatMsgs] = useState<{ role: 'user' | 'assistant'; text: string }[]>([]);
  const [termLines, setTermLines] = useState<{ type: 'cmd' | 'out'; text: string }[]>([
    { type: 'out', text: 'TroveAgent Terminal  —  claude-code mode\nType a command or describe what you need built.\n' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [termInput, setTermInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [tierInfo, setTierInfo] = useState<TierInfo | null>(null);
  const [usedCount, setUsedCount] = useState(0);
  const chatEnd = useRef<HTMLDivElement>(null);
  const termEnd = useRef<HTMLDivElement>(null);

  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [chatMsgs]);
  useEffect(() => { termEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [termLines]);

  useEffect(() => {
    fetch('/api/troveagent/status')
      .then(r => r.json())
      .then((d: TierInfo) => { setTierInfo(d); setUsedCount(getUsed(d.tier)); })
      .catch(() => setTierInfo({ tier: 'free', tierName: 'Free', limit: 3, loggedIn: false }));
  }, []);

  const tier = tierInfo?.tier ?? 'free';
  const limit = tierInfo?.limit ?? 3;
  const isUnlimited = tier === 'insider';
  const limitReached = !isUnlimited && usedCount >= limit;
  const remaining = isUnlimited ? null : Math.max(0, limit - usedCount);
  const nearLimit = !isUnlimited && remaining !== null && remaining <= 1;

  const afterSend = () => {
    incrementUsed(tier);
    setUsedCount(getUsed(tier));
  };

  const callApi = async (message: string, mode: 'chat' | 'terminal') => {
    const res = await fetch('/api/troveagent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, mode }),
    });
    const data = await res.json();
    return (data.reply as string) || 'No response.';
  };

  const sendChat = async () => {
    const text = chatInput.trim();
    if (!text || loading || limitReached) return;
    setChatInput('');
    setChatMsgs(prev => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const reply = await callApi(text, 'chat');
      setChatMsgs(prev => [...prev, { role: 'assistant', text: reply }]);
      afterSend();
    } catch {
      setChatMsgs(prev => [...prev, { role: 'assistant', text: 'Something went wrong. Please try again.' }]);
    } finally { setLoading(false); }
  };

  const sendTerm = async () => {
    const text = termInput.trim();
    if (!text || loading || limitReached) return;
    setTermInput('');
    setTermLines(prev => [...prev, { type: 'cmd', text }]);
    setLoading(true);
    try {
      const reply = await callApi(text, 'terminal');
      setTermLines(prev => [...prev, { type: 'out', text: reply }]);
      afterSend();
    } catch {
      setTermLines(prev => [...prev, { type: 'out', text: 'Error: request failed.' }]);
    } finally { setLoading(false); }
  };

  const tabBtn = (id: 'chat' | 'terminal', label: string) => (
    <button onClick={() => setTab(id)} style={{
      padding: '6px 14px', borderRadius: 3, border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
      background: tab === id ? 'var(--iron)' : 'transparent',
      color: tab === id ? 'var(--paper)' : 'var(--ash)', transition: 'all .15s', fontFamily: 'var(--font-body)',
    }}>{label}</button>
  );

  const upgradeWall = (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '20px 12px', textAlign: 'center' }}>
      <div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--paper)', marginBottom: 6, fontFamily: 'var(--font-display)' }}>
          {tier === 'free' ? "You've used all 3 free prompts" : `Daily limit of ${limit} reached`}
        </div>
        <div style={{ fontSize: 12.5, color: 'var(--ash)', lineHeight: 1.6 }}>
          {tier === 'free' ? 'Upgrade to keep chatting with TroveAgent.' : 'Your limit resets tomorrow. Upgrade to Insider for unlimited access.'}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {[
          { name: 'Supporter', detail: '100 prompts / day', highlight: tier === 'free' },
          { name: 'Insider', detail: 'Unlimited · full access', highlight: true },
        ].map(t => (
          <div key={t.name} style={{
            background: t.highlight ? 'var(--ink)' : 'transparent',
            border: `1px solid ${t.highlight ? 'var(--beacon)' : 'var(--iron)'}`,
            borderRadius: 3, padding: '12px 16px', minWidth: 130,
          }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--beacon)', marginBottom: 4 }}>{t.name}</div>
            <div style={{ fontSize: 11.5, color: 'var(--ash)' }}>{t.detail}</div>
          </div>
        ))}
      </div>
      <Link href="/members" style={{ textDecoration: 'none' }}>
        <span style={{ background: 'var(--beacon)', color: 'var(--ink)', borderRadius: 3, padding: '11px 28px', fontSize: 13, fontWeight: 700, cursor: 'pointer', display: 'inline-block' }}>
          View membership plans →
        </span>
      </Link>
    </div>
  );

  const usagePill = !isUnlimited && tierInfo && (
    <div style={{
      fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 20,
      background: 'transparent',
      border: `1px solid ${nearLimit ? 'var(--beacon)' : 'var(--iron)'}`,
      color: nearLimit ? 'var(--beacon)' : 'var(--ash)', whiteSpace: 'nowrap' as const,
      fontFamily: 'var(--font-mono)',
    }}>
      {remaining === 0 ? 'No prompts left' : `${remaining} prompt${remaining === 1 ? '' : 's'} left${tier === 'supporter' ? ' today' : ''}`}
    </div>
  );

  return (
    <PageShell>
      <Kicker>{c('trove.kicker')}</Kicker>
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 38px)',
        margin: '0 0 24px', color: 'var(--paper)',
      }}>
        {c('trove.heading')}
      </h1>

      <Panel style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid var(--iron)' }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {tabBtn('chat', 'Chat')}
            {tabBtn('terminal', 'Terminal')}
          </div>
          {usagePill}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', height: 560, padding: 16 }}>
          {tab === 'chat' && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                  <div style={{
                    maxWidth: '82%', background: 'var(--ink)', border: '1px solid var(--iron)',
                    borderRadius: 3, padding: '10px 14px', fontSize: 13.5, color: 'var(--paper)', lineHeight: 1.55,
                  }}>
                    {c('trove.welcome')}
                  </div>
                </div>
                {chatMsgs.map((m, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div style={{
                      maxWidth: '82%',
                      background: m.role === 'user' ? 'var(--beacon)' : 'var(--ink)',
                      border: m.role === 'assistant' ? '1px solid var(--iron)' : 'none',
                      borderRadius: 3,
                      padding: '10px 14px', fontSize: 13.5, color: m.role === 'user' ? 'var(--ink)' : 'var(--paper)', lineHeight: 1.55,
                    }}>
                      {renderBlocks(m.text)}
                    </div>
                  </div>
                ))}
                {loading && tab === 'chat' && (
                  <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                    <div style={{ background: 'var(--ink)', border: '1px solid var(--iron)', borderRadius: 3, padding: '10px 14px', fontSize: 13, color: 'var(--ash)' }}>Thinking…</div>
                  </div>
                )}
                <div ref={chatEnd} />
              </div>
              {limitReached ? upgradeWall : (
                <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--iron)' }}>
                  <input
                    value={chatInput}
                    onChange={e => setChatInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                    placeholder="Ask about design, code, branding…"
                    style={{ flex: 1, background: 'var(--ink)', border: '1px solid var(--iron)', borderRadius: 3, padding: '10px 14px', fontSize: 13.5, color: 'var(--paper)', outline: 'none', fontFamily: 'var(--font-body)' }}
                  />
                  <button onClick={sendChat} disabled={loading || !chatInput.trim()} style={{ background: 'var(--beacon)', border: 'none', borderRadius: 3, padding: '0 18px', fontSize: 16, cursor: loading ? 'default' : 'pointer', opacity: loading || !chatInput.trim() ? 0.5 : 1, color: 'var(--ink)' }}>↑</button>
                </div>
              )}
            </>
          )}

          {tab === 'terminal' && (
            <>
              <div style={{ flex: 1, overflowY: 'auto', background: 'var(--ink)', border: '1px solid var(--iron)', borderRadius: 3, padding: '12px 14px', fontFamily: 'var(--font-mono)', fontSize: 12.5, display: 'flex', flexDirection: 'column', gap: 6 }}>
                {termLines.map((l, i) => (
                  <div key={i}>
                    {l.type === 'cmd'
                      ? <div><span style={{ color: 'var(--beacon)', fontWeight: 700 }}>$ </span><span style={{ color: 'var(--paper)' }}>{l.text}</span></div>
                      : <div style={{ color: 'var(--ash)' }}>{renderBlocks(l.text, true)}</div>
                    }
                  </div>
                ))}
                {loading && tab === 'terminal' && <div style={{ color: 'var(--ash)' }}>▌</div>}
                <div ref={termEnd} />
              </div>
              {limitReached ? upgradeWall : (
                <div style={{ display: 'flex', gap: 8, paddingTop: 10, borderTop: '1px solid var(--iron)', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--beacon)', fontWeight: 700 }}>$</span>
                  <input
                    value={termInput}
                    onChange={e => setTermInput(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); sendTerm(); } }}
                    placeholder="write code, scaffold a project, debug…"
                    style={{ flex: 1, background: 'var(--ink)', border: '1px solid var(--iron)', borderRadius: 3, padding: '9px 12px', fontSize: 13, color: 'var(--paper)', outline: 'none', fontFamily: 'var(--font-mono)' }}
                  />
                  <button onClick={sendTerm} disabled={loading || !termInput.trim()} style={{ background: 'transparent', border: '1px solid var(--beacon)', borderRadius: 3, padding: '0 16px', height: 38, fontSize: 15, cursor: loading ? 'default' : 'pointer', opacity: loading || !termInput.trim() ? 0.4 : 1, color: 'var(--beacon)' }}>↵</button>
                </div>
              )}
            </>
          )}
        </div>
      </Panel>
    </PageShell>
  );
}
