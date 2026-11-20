'use client';

import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel, Button, Input, Textarea, Label, Mono } from '@/components/ui';
import { VoicePlayer } from '@/components/VoicePlayer';

type MemberUser = { userId: string; email: string; tier?: string; tierName?: string };
type Profile = { displayName?: string; designation?: string; cvUrl?: string; profilePicUrl?: string; bio?: string; repos?: string[] };
type ChatMessage = { id: string; content: string; fromAdmin: boolean; createdAt: string; read?: boolean };

type Stage = 'loading' | 'set-password' | 'login' | 'dashboard';

export function ProfileView() {
  const { c } = useContent();
  const searchParams = useSearchParams();
  const setPasswordToken = searchParams.get('set-password');

  const [stage, setStage] = useState<Stage>('loading');
  const [memberUser, setMemberUser] = useState<MemberUser | null>(null);

  // login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [needsPassword, setNeedsPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // set-password state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [setPwLoading, setSetPwLoading] = useState(false);
  const [setPwError, setSetPwError] = useState<string | null>(null);

  // dashboard state
  const [tab, setTab] = useState<'profile' | 'chat'>('profile');
  const [profile, setProfile] = useState<Profile>({});
  const [profileEdits, setProfileEdits] = useState<Record<string, string>>({});
  const [savingProfile, setSavingProfile] = useState(false);
  const [saved, setSaved] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState('');
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadDashboard = async (user: MemberUser) => {
    setMemberUser(user);
    setStage('dashboard');
    try {
      const p = await fetch('/api/member/profile').then(r => r.json());
      setProfile(p || {});
    } catch {}
    try {
      const msgs = await fetch('/api/member/chat').then(r => r.json());
      if (Array.isArray(msgs)) setMessages(msgs);
    } catch {}
  };

  useEffect(() => {
    if (setPasswordToken) { setStage('set-password'); return; }
    fetch('/api/member/auth').then(async r => {
      if (r.ok) {
        const user = await r.json();
        await loadDashboard(user);
      } else {
        setStage('login');
      }
    }).catch(() => setStage('login'));
  }, [setPasswordToken]);

  useEffect(() => {
    if (stage !== 'dashboard' || tab !== 'chat') return;
    const poll = async () => {
      try {
        const msgs = await fetch('/api/member/chat').then(r => r.json());
        if (Array.isArray(msgs)) setMessages(msgs);
      } catch {}
    };
    poll();
    pollRef.current = setInterval(poll, 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [stage, tab]);

  const submitLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError(null);
    try {
      const body: Record<string, string> = needsPassword ? { email, password } : { email };
      const res = await fetch('/api/member/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        await loadDashboard(data);
      } else if (data.needsPassword) {
        setNeedsPassword(true);
        setLoginError(null);
      } else {
        setLoginError(data.error || 'Something went wrong.');
      }
    } catch {
      setLoginError('Something went wrong. Try again.');
    } finally {
      setLoginLoading(false);
    }
  };

  const submitSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSetPwError(null);
    if (newPassword.length < 6) { setSetPwError('Password must be at least 6 characters.'); return; }
    if (newPassword !== confirmPassword) { setSetPwError('Passwords don’t match.'); return; }
    setSetPwLoading(true);
    try {
      const res = await fetch('/api/member/set-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: setPasswordToken, password: newPassword }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setSetPwError(data.error || 'That link is invalid or has expired.');
        setSetPwLoading(false);
        return;
      }
      const authRes = await fetch('/api/member/auth');
      if (authRes.ok) {
        const user = await authRes.json();
        await loadDashboard(user);
      } else {
        setStage('login');
      }
    } catch {
      setSetPwError('Something went wrong. Try again.');
    } finally {
      setSetPwLoading(false);
    }
  };

  const saveProfile = async () => {
    setSavingProfile(true);
    setSaved(false);
    const payload: Record<string, unknown> = { ...profileEdits };
    if ('repos' in profileEdits) {
      payload.repos = profileEdits.repos.split('\n').map(s => s.trim()).filter(Boolean);
    }
    try {
      await fetch('/api/member/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {} finally {
      setSavingProfile(false);
    }
  };

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    const content = chatInput.trim();
    if (!content) return;
    setChatInput('');
    try {
      await fetch('/api/member/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      });
      const msgs = await fetch('/api/member/chat').then(r => r.json());
      if (Array.isArray(msgs)) setMessages(msgs);
    } catch {}
  };

  const signOut = async () => {
    await fetch('/api/member/auth', { method: 'DELETE' });
    setMemberUser(null);
    setMessages([]);
    setProfile({});
    setStage('login');
  };

  const field = (key: keyof Profile) => profileEdits[key] ?? (key === 'repos' ? (profile.repos || []).join('\n') : (profile[key] as string) || '');

  const unreadCount = messages.filter(m => m.fromAdmin && m.read === false).length;

  const title = c('win.profile.title') || 'Member Profile';
  const subtitle = c('win.profile.subtitle');

  if (stage === 'loading') return <PageShell>{null}</PageShell>;

  if (stage === 'set-password') {
    return (
      <PageShell>
        <PageHeading heading="Set your password" subheading="Choose a password for your member account." />
        <Panel style={{ maxWidth: 400 }}>
          <form onSubmit={submitSetPassword} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <Label>New password</Label>
              <Input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
            </div>
            <div>
              <Label>Confirm password</Label>
              <Input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
            </div>
            {setPwError && <p style={{ fontSize: 13, color: '#e07a5f', margin: 0 }}>{setPwError}</p>}
            <Button type="submit" disabled={setPwLoading}>{setPwLoading ? 'Saving…' : 'Set password'}</Button>
          </form>
        </Panel>
      </PageShell>
    );
  }

  if (stage === 'login') {
    return (
      <PageShell>
        <PageHeading heading={c('profile.login.heading')} subheading={c('profile.login.subheading')} />
        <Panel style={{ maxWidth: 400 }}>
          <form onSubmit={submitLogin} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
            </div>
            {needsPassword && (
              <div>
                <Label>Password</Label>
                <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
              </div>
            )}
            {loginError && (
              <p style={{ fontSize: 13, color: '#e07a5f', margin: 0 }}>
                {loginError}
                {loginError.toLowerCase().includes('membership') && (
                  <> — <Link href="/members" style={{ color: 'var(--beacon)' }}>Get a membership</Link></>
                )}
              </p>
            )}
            <Button type="submit" disabled={loginLoading}>{loginLoading ? 'Signing in…' : 'Sign in'}</Button>
          </form>
        </Panel>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <PageHeading heading={title} subheading={subtitle} />
      {memberUser && (
        <p style={{ fontSize: 13, color: 'var(--ash)', marginTop: -24, marginBottom: 20 }}>
          Signed in as {memberUser.email}{memberUser.tierName ? ` · ${memberUser.tierName}` : ''}
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 4 }}>
          <button onClick={() => setTab('profile')} style={{
            padding: '7px 14px', border: 'none', borderBottom: tab === 'profile' ? '2px solid var(--beacon)' : '2px solid transparent',
            background: 'none', color: tab === 'profile' ? 'var(--paper)' : 'var(--ash)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>Profile</button>
          <button onClick={() => setTab('chat')} style={{
            padding: '7px 14px', border: 'none', borderBottom: tab === 'chat' ? '2px solid var(--beacon)' : '2px solid transparent',
            background: 'none', color: tab === 'chat' ? 'var(--paper)' : 'var(--ash)', fontWeight: 600, fontSize: 14, cursor: 'pointer', fontFamily: 'var(--font-body)',
          }}>Chat{unreadCount > 0 && <Mono style={{ marginLeft: 6, color: 'var(--beacon)' }}>{unreadCount}</Mono>}</button>
        </div>
        <Button variant="ghost" onClick={signOut}>Sign out</Button>
      </div>

      {tab === 'profile' && (
        <Panel style={{ maxWidth: 480, display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <Label>Display name</Label>
            <Input value={field('displayName')} onChange={e => setProfileEdits(p => ({ ...p, displayName: e.target.value }))} />
          </div>
          <div>
            <Label>Designation</Label>
            <Input value={field('designation')} onChange={e => setProfileEdits(p => ({ ...p, designation: e.target.value }))} />
          </div>
          <div>
            <Label>CV URL</Label>
            <Input value={field('cvUrl')} onChange={e => setProfileEdits(p => ({ ...p, cvUrl: e.target.value }))} />
          </div>
          <div>
            <Label>Profile picture URL</Label>
            <Input value={field('profilePicUrl')} onChange={e => setProfileEdits(p => ({ ...p, profilePicUrl: e.target.value }))} />
          </div>
          <div>
            <Label>Bio</Label>
            <Textarea rows={3} value={field('bio')} onChange={e => setProfileEdits(p => ({ ...p, bio: e.target.value }))} />
          </div>
          <div>
            <Label>Repos (one per line)</Label>
            <Textarea rows={3} value={field('repos')} onChange={e => setProfileEdits(p => ({ ...p, repos: e.target.value }))} />
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Button onClick={saveProfile} disabled={savingProfile}>{savingProfile ? 'Saving…' : 'Save changes'}</Button>
            {saved && <span style={{ fontSize: 13, color: 'var(--beacon)' }}>Saved</span>}
          </div>
        </Panel>
      )}

      {tab === 'chat' && (
        <Panel style={{ maxWidth: 560, display: 'flex', flexDirection: 'column', height: 440, padding: 0 }}>
          <div style={{ flex: 1, overflowY: 'auto', padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {messages.length === 0 && <p style={{ fontSize: 13, color: 'var(--ash)' }}>No messages yet — say hello.</p>}
            {messages.map(msg => {
              const isVoice = msg.content.startsWith('__VOICE_AUDIO__');
              let audioB64: string | null = null;
              let text = msg.content;
              if (isVoice) {
                const end = msg.content.indexOf('__END_AUDIO__');
                audioB64 = msg.content.slice('__VOICE_AUDIO__'.length, end === -1 ? undefined : end);
                text = end === -1 ? '' : msg.content.slice(end + '__END_AUDIO__'.length);
              }
              return (
                <div key={msg.id} style={{ display: 'flex', justifyContent: msg.fromAdmin ? 'flex-start' : 'flex-end' }}>
                  <div style={{
                    maxWidth: '82%', padding: '9px 13px', fontSize: 13.5, color: 'var(--paper)',
                    background: msg.fromAdmin ? 'var(--ink)' : 'var(--iron)',
                    border: '1px solid var(--iron)', borderRadius: 3,
                  }}>
                    {isVoice && audioB64 ? <VoicePlayer src={`data:audio/mpeg;base64,${audioB64}`} fromAdmin={msg.fromAdmin} /> : text}
                    <div style={{ fontSize: 10, color: 'var(--ash)', marginTop: 3, textAlign: 'right' }}>
                      {new Date(msg.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8, padding: 12, borderTop: '1px solid var(--iron)' }}>
            <Input value={chatInput} onChange={e => setChatInput(e.target.value)} placeholder="Send a message to lanrae…" style={{ flex: 1 }} />
            <Button type="submit">Send</Button>
          </form>
        </Panel>
      )}
    </PageShell>
  );
}
