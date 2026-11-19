import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id || !process.env.STRIPE_SECRET_KEY) {
    return <SuccessLayout><p style={{ color: 'var(--ash)' }}>No session found.</p><HomeLink /></SuccessLayout>;
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  let session: Stripe.Checkout.Session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['line_items'],
    });
  } catch {
    return <SuccessLayout><p style={{ color: 'var(--ash)' }}>Could not retrieve session.</p><HomeLink /></SuccessLayout>;
  }

  const productName = session.line_items?.data[0]?.description || 'your purchase';
  const email = session.customer_details?.email || '';
  const meta = session.metadata || {};

  let artifactUrl: string | null = null;
  let githubUrl: string | null = null;
  let vercelUrl: string | null = null;

  if (meta.productId) {
    try {
      const product = await prisma.product.findUnique({ where: { id: meta.productId } });
      artifactUrl = product?.artifactUrl || null;
      githubUrl = product?.githubUrl || null;
      vercelUrl = product?.vercelUrl || null;
    } catch {}
  }

  const hasLinks = artifactUrl || githubUrl || vercelUrl;

  return (
    <SuccessLayout>
      <div style={{ width: 56, height: 56, display: 'grid', placeItems: 'center',
        fontSize: 24, background: 'var(--beacon)', color: 'var(--ink)', margin: '0 auto 4px' }}>✓</div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 22, fontWeight: 600, margin: 0, color: 'var(--paper)' }}>Payment complete</h1>
      <p style={{ color: 'var(--ash)', fontSize: 14, margin: 0 }}>
        Thanks{email ? `, ${email.split('@')[0]}` : ''}! You bought <strong style={{ color: 'var(--paper)' }}>{productName}</strong>.
      </p>

      {hasLinks && (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 10, marginTop: 8 }}>
          <p style={{ fontSize: 13, color: 'var(--ash)', fontWeight: 500, margin: 0 }}>Access your product</p>
          {artifactUrl && (
            <a href={artifactUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '13px 18px',
                background: 'var(--beacon)', color: 'var(--ink)',
                textDecoration: 'none', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
              Download
            </a>
          )}
          {githubUrl && (
            <a href={githubUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '13px 18px',
                background: 'transparent', border: '1px solid var(--iron)',
                color: 'var(--paper)', textDecoration: 'none', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
              GitHub repo →
            </a>
          )}
          {vercelUrl && (
            <a href={vercelUrl} target="_blank" rel="noopener noreferrer"
              style={{ display: 'block', padding: '13px 18px',
                background: 'transparent', border: '1px solid var(--iron)',
                color: 'var(--paper)', textDecoration: 'none', fontWeight: 600, fontSize: 14, textAlign: 'center' }}>
              Live demo →
            </a>
          )}
        </div>
      )}

      {!hasLinks && meta.type === 'membership' && (
        <p style={{ color: 'var(--ash)', fontSize: 13, margin: 0 }}>
          Your membership is now active. Welcome to the studio.
        </p>
      )}

      <HomeLink />
    </SuccessLayout>
  );
}

function SuccessLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'var(--font-body)', color: 'var(--paper)',
    }}>
      <div style={{
        width: 'min(420px,92vw)', background: 'var(--ink-2)',
        border: '1px solid var(--iron)',
        padding: '36px 28px', display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 16, textAlign: 'center',
      }}>
        {children}
      </div>
    </div>
  );
}

function HomeLink() {
  return (
    <Link href="/" style={{
      color: 'var(--beacon)', fontSize: 14, textDecoration: 'none', fontWeight: 600, marginTop: 4,
    }}>
      ← Back to lanrae.co.uk
    </Link>
  );
}
