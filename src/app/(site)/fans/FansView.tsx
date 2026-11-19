'use client';

import { useEffect, useState } from 'react';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel, Row, Mono } from '@/components/ui';

type Fan = {
  id: string;
  rank: number;
  displayName: string;
  initials: string;
  avatarColor: string;
  totalSpent: number;
  membershipTier?: string | null;
};

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export function FansView() {
  const { c } = useContent();
  const [fans, setFans] = useState<Fan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/fans')
      .then(r => r.json())
      .then(data => setFans(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <PageShell>
      <PageHeading
        kicker={c('fans.label')}
        heading={c('fans.heading')}
        subheading={c('fans.subheading')}
      />

      <Panel style={{ padding: '4px 20px' }}>
        {loading ? (
          <div style={{ padding: '32px 0', color: 'var(--ash)', fontSize: 14 }}>Loading leaderboard…</div>
        ) : fans.length === 0 ? (
          <div style={{ padding: '32px 0', color: 'var(--ash)', fontSize: 14 }}>No fans yet — be the first.</div>
        ) : (
          fans.map(fan => (
            <Row key={fan.id}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14, minWidth: 0 }}>
                <div style={{
                  width: 28, textAlign: 'center', flexShrink: 0, fontSize: 15,
                }}>
                  {MEDAL[fan.rank] ?? <Mono style={{ color: 'var(--ash)' }}>{fan.rank}</Mono>}
                </div>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: fan.avatarColor, color: '#fff',
                  display: 'grid', placeItems: 'center',
                  fontSize: 12.5, fontWeight: 700, fontFamily: 'var(--font-display)',
                }}>
                  {fan.initials}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--paper)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fan.displayName}
                  </div>
                  {fan.membershipTier && (
                    <div style={{ fontSize: 12, color: 'var(--ash)', marginTop: 1, textTransform: 'capitalize' }}>
                      {fan.membershipTier}
                    </div>
                  )}
                </div>
              </div>
              <Mono style={{ color: 'var(--beacon)', fontWeight: 500, fontSize: 14.5, flexShrink: 0 }}>
                £{(fan.totalSpent / 100).toFixed(2)}
              </Mono>
            </Row>
          ))
        )}
      </Panel>
    </PageShell>
  );
}
