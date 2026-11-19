'use client';

import { useEffect, useRef, useState } from 'react';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel } from '@/components/ui';

type RadioStation = {
  id: string; name: string; genre: string; emoji: string;
  color: string; gradient: string; stream: string; proxy?: boolean;
};

const RADIO_STATIONS: RadioStation[] = [
  { id:'capital',     name:'Capital FM',       genre:'UK Top 40 · Pop',       emoji:'🎵', color:'#e01e5a', gradient:'linear-gradient(135deg,#7c0527,#a3103e)', stream:'https://media-ice.musicradio.com/CapitalMP3' },
  { id:'classicfm',   name:'Classic FM',       genre:'Classical',             emoji:'🎻', color:'#7c6cff', gradient:'linear-gradient(135deg,#1e1b4b,#312e81)', stream:'https://media-ice.musicradio.com/ClassicFMMP3' },
  { id:'kissfm',      name:'Kiss FM UK',       genre:'Dance · R&B',           emoji:'💋', color:'#f43f5e', gradient:'linear-gradient(135deg,#4c0519,#9f1239)', stream:'https://media-ice.musicradio.com/KISSMP3',     proxy:true },
  { id:'heart',       name:'Heart FM',         genre:'Easy Listening · Pop',  emoji:'💗', color:'#f472b6', gradient:'linear-gradient(135deg,#831843,#9d174d)', stream:'https://media-ice.musicradio.com/HeartMP3',    proxy:true },
  { id:'radiox',      name:'Radio X',          genre:'Rock · Indie',          emoji:'🎸', color:'#f97316', gradient:'linear-gradient(135deg,#7c2d12,#9a3412)', stream:'https://media-ice.musicradio.com/RadioXMP3' },
  { id:'lbc',         name:'LBC',              genre:'News · Talk',           emoji:'📢', color:'#fbbf24', gradient:'linear-gradient(135deg,#78350f,#92400e)', stream:'https://media-ice.musicradio.com/LBCMP3',      proxy:true },
  { id:'smooth',      name:'Smooth Radio',     genre:'Soul · R&B · Chill',    emoji:'🌊', color:'#60a5fa', gradient:'linear-gradient(135deg,#1e3a5f,#1e40af)', stream:'https://media-ice.musicradio.com/SmoothMP3',   proxy:true },
  { id:'nts1',        name:'NTS Radio 1',      genre:'UK · Eclectic · Live',  emoji:'🇬🇧', color:'#f43f5e', gradient:'linear-gradient(135deg,#4c0519,#9f1239)', stream:'https://stream-relay-geo.ntslive.co.uk/stream' },
  { id:'beatfm',      name:'Beat FM',          genre:'Afrobeats · Urban',     emoji:'🥁', color:'#f59e0b', gradient:'linear-gradient(135deg,#78350f,#b45309)', stream:'https://beatfm.out.airtime.pro/beatfm_b',      proxy:true },
  { id:'kexp',        name:'KEXP 90.3',        genre:'Indie · Alternative',   emoji:'📻', color:'#22c55e', gradient:'linear-gradient(135deg,#064e3b,#065f46)', stream:'https://kexp-mp3-128.streamguys1.com/kexp128.mp3' },
  { id:'radioparadise', name:'Radio Paradise', genre:'Indie · Rock · World',  emoji:'🌍', color:'#34d399', gradient:'linear-gradient(135deg,#064e3b,#065f46)', stream:'https://stream.radioparadise.com/mp3-128' },
  { id:'wfmu',        name:'WFMU',             genre:'Freeform · Eclectic',   emoji:'📡', color:'#94a3b8', gradient:'linear-gradient(135deg,#1e293b,#334155)', stream:'https://stream0.wfmu.org/freeform-128k.mp3' },
  { id:'groovesalad', name:'Groove Salad',     genre:'Ambient · Chill',       emoji:'🌿', color:'#4ade80', gradient:'linear-gradient(135deg,#14532d,#166534)', stream:'https://ice1.somafm.com/groovesalad-256-mp3' },
  { id:'secretagent', name:'Secret Agent',     genre:'Lounge · Spy Jazz',     emoji:'🕵️', color:'#818cf8', gradient:'linear-gradient(135deg,#1e1b4b,#312e81)', stream:'https://ice1.somafm.com/secretagent-128-mp3' },
  { id:'beatblender', name:'Beat Blender',     genre:'Electronic · House',    emoji:'🎛️', color:'#a78bfa', gradient:'linear-gradient(135deg,#4c1d95,#5b21b6)', stream:'https://ice1.somafm.com/beatblender-256-mp3' },
  { id:'illstreet',   name:'Ill Street Blues', genre:'Hip Hop · Beats',       emoji:'🎧', color:'#f59e0b', gradient:'linear-gradient(135deg,#78350f,#92400e)', stream:'https://ice1.somafm.com/illstreet-256-mp3' },
  { id:'lush',        name:'Lush',             genre:'Indie Pop · Female',    emoji:'🌸', color:'#f472b6', gradient:'linear-gradient(135deg,#831843,#9d174d)', stream:'https://ice1.somafm.com/lush-256-mp3' },
  { id:'u80s',        name:'Underground 80s',  genre:'80s · Synthpop',        emoji:'🕺', color:'#fb923c', gradient:'linear-gradient(135deg,#7c2d12,#9a3412)', stream:'https://ice1.somafm.com/u80s-256-mp3' },
];

function RadioApp() {
  const [stationId, setStationId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.8);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const station: RadioStation | null = RADIO_STATIONS.find(s => s.id === stationId) ?? null;

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      (audioRef.current as HTMLAudioElement & { referrerPolicy: string }).referrerPolicy = 'no-referrer';
    }
  }, [volume]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const play = (s: RadioStation) => {
    const audio = audioRef.current;
    if (!audio) return;
    setError(false);
    setLoading(true);
    setPlaying(false);
    setStationId(s.id);
    audio.src = s.proxy
      ? `/api/radio-proxy?url=${encodeURIComponent(s.stream)}`
      : s.stream;
    audio.play().catch((err: Error) => {
      if (err.name === 'AbortError') return;
      setLoading(false);
      setError(true);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio || !station) return;
    if (playing) {
      audio.pause();
    } else {
      setLoading(true);
      audio.play().catch((err: Error) => {
        if (err.name === 'AbortError') return;
        setLoading(false);
        setError(true);
      });
    }
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      <audio
        ref={audioRef}
        onPlaying={() => { setLoading(false); setPlaying(true); setError(false); }}
        onWaiting={() => setLoading(true)}
        onPause={() => { setPlaying(false); setLoading(false); }}
        onError={() => { setLoading(false); setError(true); setPlaying(false); }}
      />

      {station && (
        <div style={{ borderRadius:3, padding:'16px 18px', background:station.gradient, border:'1px solid var(--iron)', display:'flex', gap:16, alignItems:'center' }}>
          <div style={{ fontSize:32, lineHeight:1 }}>{station.emoji}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontWeight:700, fontSize:15, color:'#fff' }}>{station.name}</div>
            <div style={{ fontSize:12, color:'rgba(255,255,255,.7)', marginTop:2 }}>{station.genre}</div>
            {error && <div style={{ fontSize:11, color:'#fca5a5', marginTop:4 }}>Stream error — try another station</div>}
          </div>
          <button onClick={togglePlay} disabled={loading}
            style={{ width:42, height:42, borderRadius:'50%', border:'none', background:'rgba(255,255,255,.2)', fontSize:17, cursor:'pointer', display:'grid', placeItems:'center', color:'#fff' }}>
            {loading ? <div style={{ width:16, height:16, borderRadius:'50%', border:'2px solid rgba(255,255,255,.3)', borderTopColor:'#fff', animation:'radioSpin 0.7s linear infinite' }} />
              : playing ? '⏸' : '▶'}
          </button>
        </div>
      )}

      {station && (
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <span style={{ fontSize:14 }}>🔈</span>
          <input type="range" min={0} max={1} step={0.05} value={volume}
            onChange={e => { setVolume(parseFloat(e.target.value)); }}
            style={{ flex:1, accentColor:'var(--beacon)', cursor:'pointer' }} />
          <span style={{ fontSize:14 }}>🔊</span>
        </div>
      )}

      <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:9 }}>
        {RADIO_STATIONS.map(s => (
          <button key={s.id} onClick={() => play(s)}
            style={{ background: stationId === s.id ? s.gradient : 'var(--ink-2)',
              border: `1px solid ${stationId === s.id ? 'transparent' : 'var(--iron)'}`,
              borderRadius:3, padding:'12px 13px', display:'flex', gap:10, alignItems:'center',
              cursor:'pointer', fontFamily:'inherit', textAlign:'left' }}>
            <span style={{ fontSize:20, lineHeight:1 }}>{s.emoji}</span>
            <div style={{ minWidth:0 }}>
              <div style={{ fontWeight:600, fontSize:13, color: stationId === s.id ? '#fff' : 'var(--paper)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{s.name}</div>
              <div style={{ fontSize:11, color: stationId === s.id ? 'rgba(255,255,255,.7)' : 'var(--ash)', marginTop:1 }}>{s.genre}</div>
            </div>
            {stationId === s.id && playing && <span style={{ marginLeft:'auto', fontSize:10, color:'rgba(255,255,255,.8)', fontWeight:700 }}>LIVE</span>}
          </button>
        ))}
      </div>
      <style>{`@keyframes radioSpin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function RadioView() {
  const { c } = useContent();
  const [tab, setTab] = useState<'radio' | 'spotify'>('radio');

  return (
    <PageShell>
      <PageHeading kicker="Music" heading="Radio" subheading="Live internet radio, or a playlist — your call." />

      <div style={{ display: 'flex', gap: 4, marginBottom: 20, borderBottom: '1px solid var(--iron)' }}>
        {(['radio', 'spotify'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '9px 16px', background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 600,
            color: tab === t ? 'var(--paper)' : 'var(--ash)',
            borderBottom: tab === t ? '2px solid var(--beacon)' : '2px solid transparent',
            marginBottom: -1, fontFamily: 'var(--font-body)',
          }}>
            {t === 'radio' ? 'Live Radio' : 'Spotify'}
          </button>
        ))}
      </div>

      {tab === 'radio' ? <RadioApp /> : (
        <Panel>
          <p style={{ fontSize: 13, color: 'var(--ash)', marginBottom: 14, lineHeight: 1.5 }}>
            Full tracks play when you&apos;re logged in to Spotify. Not logged in? You&apos;ll hear 30-second previews —{' '}
            <a href="https://accounts.spotify.com/login" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--beacon)', textDecoration: 'none', fontWeight: 600 }}>sign in here</a> then come back.
          </p>
          <iframe
            src={c('spotify.embedUrl')}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            style={{ borderRadius: 3, display: 'block' }}
          />
        </Panel>
      )}
    </PageShell>
  );
}
