'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel, Mono, Button } from '@/components/ui';
import { Checkout, type CheckoutProduct } from '@/components/Checkout';

type Tier = { id: string; tier: string; name: string; price: number; features: string[] };
type MemberUser = { userId: string; email: string; tier?: string; tierName?: string };

const FALLBACK_TIERS: Tier[] = [
  { id: 'explorer', tier: 'explorer', name: 'Explorer', price: 0, features: ['Browse every launch', 'Community changelog'] },
  { id: 'supporter', tier: 'supporter', name: 'Supporter', price: 500, features: ['Everything in Explorer', 'Early access to launches', 'Name on Supporters wall', 'Vote on the roadmap'] },
  { id: 'insider', tier: 'insider', name: 'Insider', price: 1500, features: ['Everything in Supporter', 'Entire product library', 'Top 10 Fans eligible', 'Source access + build logs', 'Monthly office hours'] },
];

const TIER_ICON: Record<string, string> = { explorer: '🧭', supporter: '⭐', insider: '🏆' };
const TIER_COLOR: Record<string, string> = { explorer: 'var(--ash)', supporter: 'var(--beacon)', insider: 'var(--beacon)' };

function fmtPrice(pence: number) {
  return pence === 0 ? 'Free' : `£${(pence / 100).toFixed(2)}/mo`;
}

export function MembersView() {
  const { c } = useContent();
  const [tiers, setTiers] = useState<Tier[]>(FALLBACK_TIERS);
  const [memberUser, setMemberUser] = useState<MemberUser | null>(null);
  const [weekCount, setWeekCount] = useState(0);
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/memberships').then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.length > 0) setTiers(d);
    }).catch(() => {}).finally(() => setLoaded(true));

    fetch('/api/member/auth').then(r => (r.ok ? r.json() : null)).then(d => {
      if (d && d.userId) setMemberUser(d);
    }).catch(() => {});

    fetch('/api/social-proof').then(r => r.json()).then(d => {
      if (typeof d?.weekCount === 'number') setWeekCount(d.weekCount);
    }).catch(() => {});
  }, []);

  const subscribeTo = (tier: Tier) => {
    setCheckoutProduct({
      id: tier.tier,
      name: tier.name,
      icon: TIER_ICON[tier.tier] ?? '🪪',
      gradient: 'var(--ink-2)',
      price: tier.price,
      isFree: tier.price === 0,
    });
  };

  const currentTier = memberUser ? tiers.find(t => t.tier === memberUser.tier) : null;
  const insiderTier = tiers.find(t => t.tier === 'insider');
  const isInsider = memberUser?.tier === 'insider';

  return (
    <PageShell>
      <PageHeading
        kicker={c('members.label')}
        heading={c('members.heading')}
        subheading={c('members.subheading')}
      />

      {weekCount > 0 && (
        <p style={{ fontSize: 13, color: 'var(--ash)', marginTop: -24, marginBottom: 32 }}>
          🔥 <Mono style={{ color: 'var(--beacon)' }}>{weekCount}</Mono> joined this week
        </p>
      )}

      {!loaded ? null : memberUser ? (
        /* ── logged in dashboard ── */
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <Panel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
              <div style={{ fontSize: 28 }}>{TIER_ICON[memberUser.tier ?? ''] ?? '🪪'}</div>
              <div>
                <div style={{ fontSize: 12, color: 'var(--ash)' }}>Current plan</div>
                <div style={{ fontSize: 19, fontWeight: 600, fontFamily: 'var(--font-display)', color: TIER_COLOR[memberUser.tier ?? ''] ?? 'var(--paper)' }}>
                  {memberUser.tierName ?? currentTier?.name ?? 'Member'}
                </div>
              </div>
            </div>
            {currentTier && currentTier.features.length > 0 && (
              <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                {currentTier.features.map(f => (
                  <li key={f} style={{ fontSize: 14, color: 'var(--paper)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--beacon)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link href="/profile" style={{ textDecoration: 'none' }}><Button variant="secondary">My profile</Button></Link>
            <Link href="/request" style={{ textDecoration: 'none' }}><Button variant="secondary">Request a build</Button></Link>
          </div>

          {!isInsider && insiderTier && (
            <Panel style={{ borderColor: 'var(--beacon-dim)' }}>
              <div style={{ fontSize: 13, color: 'var(--ash)', marginBottom: 6 }}>Upgrade</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 12 }}>
                <div style={{ fontSize: 18, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--paper)' }}>{insiderTier.name}</div>
                <Mono style={{ fontSize: 16, color: 'var(--beacon)' }}>{fmtPrice(insiderTier.price)}</Mono>
              </div>
              <ul style={{ margin: '0 0 16px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 6 }}>
                {insiderTier.features.map(f => (
                  <li key={f} style={{ fontSize: 13.5, color: 'var(--ash)', display: 'flex', gap: 8 }}>
                    <span style={{ color: 'var(--beacon)' }}>✓</span> {f}
                  </li>
                ))}
              </ul>
              <Button variant="primary" onClick={() => subscribeTo(insiderTier)}>Upgrade to Insider</Button>
            </Panel>
          )}
        </div>
      ) : (
        /* ── logged out pricing ── */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: 16 }}>
          {tiers.map(tier => {
            const highlight = tier.tier === 'supporter';
            return (
              <Panel key={tier.id} style={highlight ? { borderColor: 'var(--beacon-dim)' } : undefined}>
                <div style={{ fontSize: 22, marginBottom: 10 }}>{TIER_ICON[tier.tier] ?? '🪪'}</div>
                <div style={{ fontSize: 17, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--paper)' }}>{tier.name}</div>
                <Mono style={{ fontSize: 22, color: 'var(--beacon)', display: 'block', marginTop: 6, marginBottom: 16 }}>
                  {fmtPrice(tier.price)}
                </Mono>
                <ul style={{ margin: '0 0 20px', padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {tier.features.map(f => (
                    <li key={f} style={{ fontSize: 13.5, color: 'var(--ash)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--beacon)' }}>✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Button variant={highlight ? 'primary' : 'secondary'} onClick={() => subscribeTo(tier)} style={{ width: '100%' }}>
                  {tier.price === 0 ? 'Get started free' : 'Subscribe'}
                </Button>
              </Panel>
            );
          })}
        </div>
      )}

      <Checkout product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
    </PageShell>
  );
}
