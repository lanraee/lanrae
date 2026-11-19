'use client';

import { useState } from 'react';
import { PageShell, PageHeading, Panel, Mono, Button } from '@/components/ui';
import { Checkout, type CheckoutProduct } from '@/components/Checkout';
import { useContent } from '@/lib/useContent';

const AMOUNTS = [3, 7, 15, 30, 50];

export function SupportView() {
  const { c } = useContent();
  const [amount, setAmount] = useState(7);
  const [checkoutProduct, setCheckoutProduct] = useState<CheckoutProduct | null>(null);

  const handleTip = () => {
    setCheckoutProduct({
      id: 'donate',
      name: 'Support lanrae',
      icon: '☕',
      gradient: 'var(--ink-2)',
      price: amount * 100,
      isFree: false,
    });
  };

  return (
    <PageShell>
      <PageHeading
        kicker={c('donate.label')}
        heading={c('donate.heading')}
        subheading={c('donate.subheading')}
      />

      <Panel style={{ maxWidth: 480 }}>
        <div style={{ fontSize: 13, color: 'var(--ash)', marginBottom: 14, fontWeight: 500 }}>
          Choose an amount
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
          {AMOUNTS.map(a => (
            <button
              key={a}
              onClick={() => setAmount(a)}
              style={{
                padding: '10px 18px',
                borderRadius: 3,
                border: `1px solid ${amount === a ? 'var(--beacon)' : 'var(--iron)'}`,
                background: amount === a ? 'var(--beacon)' : 'transparent',
                color: amount === a ? 'var(--ink)' : 'var(--paper)',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                fontSize: 14.5,
                cursor: 'pointer',
                transition: 'border-color .15s ease, background .15s ease, color .15s ease',
              }}
            >
              £{a}
            </button>
          ))}
        </div>

        <Button onClick={handleTip} style={{ width: '100%' }}>
          Tip <Mono style={{ marginLeft: 4 }}>£{amount}</Mono>
        </Button>

        <div style={{ marginTop: 18, paddingTop: 16, borderTop: '1px solid var(--iron-soft)', fontSize: 13, color: 'var(--ash)' }}>
          💛 142 supporters have tipped this month
        </div>
      </Panel>

      <Checkout product={checkoutProduct} onClose={() => setCheckoutProduct(null)} />
    </PageShell>
  );
}
