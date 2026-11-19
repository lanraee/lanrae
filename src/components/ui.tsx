import type { CSSProperties, ReactNode } from 'react';

/** Shared "Manifest" design primitives — hairlines over shadows, flat fills over
 *  gradients, monospace reserved for real figures. Keep every new page on these. */

export function PageShell({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      minHeight: '100vh', background: 'var(--ink)', color: 'var(--paper)',
      fontFamily: 'var(--font-body)', ...style,
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto', padding: '48px 24px 96px' }}>
        {children}
      </div>
    </div>
  );
}

export function Kicker({ children }: { children: ReactNode }) {
  return (
    <div style={{ fontSize: 13.5, color: 'var(--ash)', marginBottom: 10, fontWeight: 500 }}>
      {children}
    </div>
  );
}

export function PageHeading({ kicker, heading, subheading }: { kicker?: string; heading: string; subheading?: string }) {
  return (
    <header style={{ marginBottom: 40 }}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h1 style={{
        fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 'clamp(28px, 4.2vw, 42px)',
        lineHeight: 1.1, letterSpacing: '-.01em', margin: 0, color: 'var(--paper)', maxWidth: '18ch',
      }}>
        {heading}
      </h1>
      {subheading && (
        <p style={{ fontSize: 16, color: 'var(--ash)', marginTop: 14, maxWidth: '58ch', lineHeight: 1.55 }}>
          {subheading}
        </p>
      )}
    </header>
  );
}

export function Panel({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      background: 'var(--ink-2)', border: '1px solid var(--iron)', borderRadius: 3,
      padding: 20, ...style,
    }}>
      {children}
    </div>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16,
      padding: '16px 0', borderBottom: '1px solid var(--iron-soft)', ...style,
    }}>
      {children}
    </div>
  );
}

export function Mono({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.92em', ...style }}>{children}</span>;
}

export function StatusDot({ color = 'var(--beacon)' }: { color?: string }) {
  return <span style={{ width: 6, height: 6, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />;
}

type ButtonProps = {
  children: ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: CSSProperties;
};

export function Button({ children, onClick, type = 'button', variant = 'primary', disabled, style }: ButtonProps) {
  const base: CSSProperties = {
    fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: 14.5, borderRadius: 3,
    padding: '11px 20px', cursor: disabled ? 'not-allowed' : 'pointer', border: '1px solid transparent',
    transition: 'opacity .15s ease, border-color .15s ease', opacity: disabled ? 0.5 : 1,
  };
  const variants: Record<string, CSSProperties> = {
    primary: { background: 'var(--beacon)', color: 'var(--ink)' },
    secondary: { background: 'transparent', color: 'var(--paper)', border: '1px solid var(--iron)' },
    ghost: { background: 'transparent', color: 'var(--ash)' },
  };
  return (
    <button type={type} onClick={onClick} disabled={disabled} style={{ ...base, ...variants[variant], ...style }}>
      {children}
    </button>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} style={{
      width: '100%', background: 'var(--ink)', border: '1px solid var(--iron)', borderRadius: 3,
      padding: '11px 13px', fontSize: 14.5, color: 'var(--paper)', fontFamily: 'var(--font-body)',
      outline: 'none', ...props.style,
    }} />
  );
}

export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} style={{
      width: '100%', background: 'var(--ink)', border: '1px solid var(--iron)', borderRadius: 3,
      padding: '11px 13px', fontSize: 14.5, color: 'var(--paper)', fontFamily: 'var(--font-body)',
      outline: 'none', resize: 'vertical', ...props.style,
    }} />
  );
}

export function Label({ children }: { children: ReactNode }) {
  return (
    <label style={{ display: 'block', fontSize: 13, color: 'var(--ash)', marginBottom: 6, fontWeight: 500 }}>
      {children}
    </label>
  );
}
