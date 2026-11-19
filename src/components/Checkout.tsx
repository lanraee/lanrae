'use client';

import { useEffect, useState } from 'react';

export type CheckoutProduct = {
  id: string;
  name: string;
  icon: string | null;
  gradient: string;
  price: number; // pence; ignored when isFree
  isFree?: boolean;
  artifactUrl?: string | null;
};

const MEMBERSHIP_TIERS = ['explorer', 'supporter', 'insider'];

export function Checkout({ product, onClose }: { product: CheckoutProduct | null; onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => { setLoading(false); setError(null); }, [product]);
  if (!product) return null;
  const price = product.isFree ? 0 : product.price / 100;

  const handlePay = async () => {
    if (product.isFree) {
      if (product.artifactUrl) window.open(product.artifactUrl, '_blank');
      onClose();
      return;
    }
    setLoading(true);
    setError(null);
    try {
      let body: Record<string, unknown>;
      if (product.id === 'donate') {
        body = { type: 'donate', amount: price };
      } else if (MEMBERSHIP_TIERS.includes(product.id.toLowerCase())) {
        body = { type: 'membership', membershipTier: product.id.toLowerCase() };
      } else {
        body = { type: 'product', productId: product.id };
      }
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || 'Something went wrong');
        setLoading(false);
      }
    } catch {
      setError('Failed to start checkout');
      setLoading(false);
    }
  };

  return (
    <div onClick={e => { if (e.target === e.currentTarget) onClose(); }}
      style={{ position: 'fixed', inset: 0, zIndex: 2000, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'rgba(7,6,4,.7)', backdropFilter: 'blur(6px)' }}>
      <div style={{ width: 'min(400px,92vw)', background: 'var(--ink-2)',
        border: '1px solid var(--iron)', borderRadius: 3,
        boxShadow: '0 40px 90px rgba(0,0,0,.6)', overflow: 'hidden',
        animation: 'checkoutRise .25s cubic-bezier(.2,.9,.3,1.1)', fontFamily: 'var(--font-body)' }}>
        <div style={{ padding: '18px 20px', borderBottom: '1px solid var(--iron)',
          display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 42, height: 42, borderRadius: 3, display: 'grid', placeItems: 'center',
            fontSize: 20, background: product.gradient, border: '1px solid var(--iron)' }}>{product.icon}</div>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, margin: 0, color: 'var(--paper)', fontFamily: 'var(--font-display)' }}>{product.name}</h3>
            <p style={{ fontSize: 12, color: 'var(--ash)', margin: '2px 0 0' }}>lanrae.co.uk · secure checkout</p>
          </div>
        </div>
        <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ color: 'var(--ash)', fontSize: 13 }}>Total</span>
            <span style={{ fontSize: 24, fontWeight: 700, fontFamily: 'var(--font-mono)', color: 'var(--paper)' }}>£{price.toFixed(2)}</span>
          </div>
          {error && <p style={{ fontSize: 13, color: '#e07a5f', margin: 0 }}>{error}</p>}
          <button onClick={handlePay} disabled={loading}
            style={{ background: loading ? 'var(--beacon-dim)' : 'var(--beacon)',
              color: '#15130f', border: 'none', padding: '13px', borderRadius: 3, fontSize: 14,
              fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
              width: '100%', fontFamily: 'inherit', transition: 'opacity .2s' }}>
            {loading ? 'Redirecting…' : `Pay £${price.toFixed(2)} with Stripe`}
          </button>
        </div>
        <div style={{ padding: '12px', borderTop: '1px solid var(--iron)',
          textAlign: 'center', fontSize: 11, color: 'var(--ash)' }}>
          🔒 Secure payment powered by <b style={{ color: 'var(--paper)' }}>Stripe</b>
        </div>
      </div>
      <style>{`@keyframes checkoutRise{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}
