'use client';

import { useState } from 'react';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel, Button, Input, Textarea, Label } from '@/components/ui';

type Status = 'idle' | 'sending' | 'sent' | 'error';

const EMPTY_FORM = { name: '', email: '', title: '', description: '' };

export function RequestView() {
  const { c } = useContent();
  const [form, setForm] = useState(EMPTY_FORM);
  const [status, setStatus] = useState<Status>('idle');
  const [errorText, setErrorText] = useState<string | null>(null);

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    setErrorText(null);
    try {
      const res = await fetch('/api/project-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrorText(data.error || 'The request did not go through. Try again.');
        setStatus('error');
        return;
      }
      setStatus('sent');
    } catch {
      setErrorText('The request did not go through. Check your connection and try again.');
      setStatus('error');
    }
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setStatus('idle');
    setErrorText(null);
  };

  return (
    <PageShell>
      <PageHeading
        kicker={c('request.label')}
        heading={c('request.heading')}
        subheading={c('request.subheading')}
      />

      {status === 'sent' ? (
        <Panel style={{ maxWidth: 560 }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--paper)', fontFamily: 'var(--font-display)' }}>
            Request submitted.
          </div>
          <p style={{ fontSize: 14, color: 'var(--ash)', marginTop: 8, lineHeight: 1.6 }}>
            It&apos;s in the queue. Top-voted requests shape what gets built next.
          </p>
          <div style={{ marginTop: 16 }}>
            <Button variant="secondary" onClick={resetForm}>Submit another</Button>
          </div>
        </Panel>
      ) : (
        <Panel style={{ maxWidth: 560 }}>
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 200px' }}>
                <Label>Name</Label>
                <Input required value={form.name} onChange={set('name')} placeholder="Your name" />
              </div>
              <div style={{ flex: '1 1 200px' }}>
                <Label>Email</Label>
                <Input required type="email" value={form.email} onChange={set('email')} placeholder="you@example.com" />
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input required value={form.title} onChange={set('title')} placeholder="What should I build?" />
            </div>
            <div>
              <Label>Description</Label>
              <Textarea required rows={6} value={form.description} onChange={set('description')} placeholder="Describe the idea, who it's for, and why it matters." />
            </div>

            {status === 'error' && errorText && (
              <p style={{ fontSize: 13.5, color: '#e07a5f', margin: 0 }}>{errorText}</p>
            )}

            <div>
              <Button type="submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Submit request'}
              </Button>
            </div>
          </form>
        </Panel>
      )}
    </PageShell>
  );
}
