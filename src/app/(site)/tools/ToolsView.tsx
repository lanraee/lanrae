'use client';

import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel, Row } from '@/components/ui';

const TOOLS = [
  { name: '10MinuteMail',    cat: 'Anonymity', icon: '📧', desc: 'Disposable temp email address that auto-expires in 10 minutes.', url: 'https://10minutemail.com/' },
  { name: 'AnonAddy',        cat: 'Anonymity', icon: '✉️', desc: 'Open-source anonymous email forwarding with unlimited aliases.', url: 'https://anonaddy.com/' },
  { name: 'SimpleLogin',     cat: 'Anonymity', icon: '🛡️', desc: 'Email alias service — forward to your real inbox, stay anonymous.', url: 'https://simplelogin.io/' },
  { name: 'MailDrop',        cat: 'Anonymity', icon: '📬', desc: 'Simple free temporary email inbox with no sign-up required.', url: 'https://maildrop.cc/' },
  { name: 'OnlineSIM',       cat: 'Anonymity', icon: '📱', desc: 'Online virtual phone numbers for SMS verification worldwide.', url: 'https://onlinesim.net/' },
  { name: 'Receive SMS',     cat: 'Anonymity', icon: '💬', desc: 'Free public SMS inbox — receive verification codes anonymously.', url: 'https://hs3x.com/' },
  { name: 'SMStome',         cat: 'Anonymity', icon: '📲', desc: 'Receive SMS online free using shared virtual numbers globally.', url: 'https://smstome.com' },
  { name: 'Twilio',          cat: 'Anonymity', icon: '☎️', desc: 'Programmable virtual numbers — send/receive SMS at scale.', url: 'https://www.twilio.com/' },
  { name: 'FaxZero',         cat: 'Anonymity', icon: '📠', desc: 'Send faxes for free without revealing your identity.', url: 'https://faxzero.com/' },
  { name: 'Globfone',        cat: 'Anonymity', icon: '🌐', desc: 'Send free anonymous text messages to mobiles worldwide.', url: 'https://globfone.com/send-text/' },
  { name: 'Fake Name Gen',   cat: 'Identity',  icon: '🪪', desc: 'Generate complete fake identities: name, address, CC, and more.', url: 'https://www.fakenamegenerator.com/' },
  { name: 'Username Gen',    cat: 'Identity',  icon: '🏷️', desc: 'Create secure, unique usernames for anonymous accounts.', url: 'https://www.lastpass.com/features/username-generator' },
  { name: 'IntelTechniques', cat: 'Intel',     icon: '🕵️', desc: "Michael Bazzell's comprehensive OSINT suite — the gold standard.", url: 'https://inteltechniques.com/tools/' },
  { name: 'SynapsInt',       cat: 'Intel',     icon: '🔗', desc: 'Unified OSINT search aggregating results from dozens of sources.', url: 'https://synapsint.com/' },
  { name: 'IDCrawl',         cat: 'Intel',     icon: '🆔', desc: 'Free people search engine that finds profiles across the web.', url: 'https://www.idcrawl.com/' },
  { name: 'WebMii',          cat: 'Intel',     icon: '🕸️', desc: 'Search for people online — aggregates social profiles and mentions.', url: 'https://webmii.com/' },
  { name: 'Criminal IP',     cat: 'Intel',     icon: '🔴', desc: 'AI-powered cyber threat intel — scan IPs, domains, and URLs.', url: 'https://www.criminalip.io/' },
  { name: 'IntelX Person',   cat: 'Intel',     icon: '🔎', desc: 'Intelligence X — search leaked data, dark web, and public records.', url: 'https://intelx.io/tools?tab=person' },
  { name: 'LinkScope',       cat: 'Intel',     icon: '🔭', desc: 'Open-source OSINT client for visualising data relationships.', url: 'https://github.com/AccentuSoft/LinkScope_Client' },
  { name: 'osrframework',    cat: 'Intel',     icon: '🐍', desc: 'Python OSINT framework — username, email & domain investigation.', url: 'https://pypi.org/project/osrframework/' },
  { name: 'TruePeopleSearch',cat: 'People',    icon: '👤', desc: 'Free US people search — addresses, phone numbers, relatives.', url: 'https://www.truepeoplesearch.com/' },
  { name: 'FastPeopleSearch',cat: 'People',    icon: '⚡', desc: 'Instant people search with addresses, phones & background info.', url: 'https://fastpeoplesearch.com/' },
  { name: 'PeopleFinder',    cat: 'People',    icon: '🔍', desc: 'Search public records to find people and background information.', url: 'https://www.peoplefinder.com/' },
  { name: 'Yandex People',   cat: 'People',    icon: '👥', desc: 'Yandex social profile search — find people across Russian networks.', url: 'https://yandex.ru/people' },
  { name: 'SpyTox',          cat: 'People',    icon: '📞', desc: 'Reverse phone lookup — find the owner of any number.', url: 'https://www.spytox.com/' },
  { name: 'UsernameSearch',  cat: 'People',    icon: '🔐', desc: 'Search a username across hundreds of social networks at once.', url: 'https://usersearch.org/' },
  { name: 'Google Advanced', cat: 'Search',    icon: '🔍', desc: 'Google advanced search with fine-grained filters and operators.', url: 'https://www.google.com/advanced_search' },
  { name: 'Yandex Search',   cat: 'Search',    icon: '🌐', desc: 'Russian search engine with superior reverse image search.', url: 'https://yandex.com/' },
  { name: 'Searx',           cat: 'Search',    icon: '🔒', desc: 'Privacy-respecting metasearch engine — no tracking, open source.', url: 'https://searx.info/' },
  { name: 'DuckDuckGo',      cat: 'Search',    icon: '🦆', desc: 'Privacy-focused search — no tracking, no filter bubbles.', url: 'https://duckduckgo.com/' },
  { name: 'Startpage',       cat: 'Search',    icon: '🛡️', desc: 'Google results without tracking — the private Google alternative.', url: 'https://startpage.com/' },
  { name: 'Brave Search',    cat: 'Search',    icon: '🦁', desc: 'Independent search index — no Google, no tracking, no censorship.', url: 'https://search.brave.com/' },
  { name: 'Baidu',           cat: 'Search',    icon: '🇨🇳', desc: "China's dominant search engine — unique indexing of Chinese web.", url: 'https://www.baidu.com/' },
  { name: 'Carrot2',         cat: 'Search',    icon: '🥕', desc: 'Clustering search engine — organises results into topic groups.', url: 'https://search.carrot2.org/#/search/web' },
  { name: 'Crossref',        cat: 'Search',    icon: '📚', desc: 'Search academic papers, DOIs, and scholarly publications.', url: 'https://search.crossref.org/' },
  { name: 'OSINT CSE',       cat: 'CSE',       icon: '🔎', desc: 'Google Custom Search Engine optimised for OSINT investigations.', url: 'https://cse.google.com/cse/publicurl?cx=006290531980334157382:qcaf4enph7i' },
  { name: 'Mailing List CSE',cat: 'CSE',       icon: '📋', desc: 'Google CSE for searching mailing lists and email archives.', url: 'https://cse.google.com/cse/publicurl?cx=013991603413798772546:sipriovnbxq' },
  { name: 'Satellites.pro',  cat: 'Geo',       icon: '🛰️', desc: 'High-res satellite imagery — compare Google, Bing, Yandex & more.', url: 'https://satellites.pro/' },
  { name: 'Mapillary',       cat: 'Geo',       icon: '📸', desc: 'Crowd-sourced street-level imagery — open alternative to Street View.', url: 'https://www.mapillary.com/app/' },
  { name: 'Wikimapia',       cat: 'Geo',       icon: '🗺️', desc: 'Wikipedia-style map with community annotations on every place.', url: 'http://wikimapia.org/' },
  { name: 'OpenStreetMap',   cat: 'Geo',       icon: '🗾', desc: 'Free editable world map built by volunteers — the open geo standard.', url: 'https://www.openstreetmap.org/' },
  { name: 'Live UA Map',     cat: 'Geo',       icon: '🇺🇦', desc: 'Real-time interactive map of Ukraine conflict zone events.', url: 'https://liveuamap.com/' },
  { name: 'FIRMS NASA',      cat: 'Geo',       icon: '🔥', desc: 'NASA Fire Information — global near-real-time fire detection map.', url: 'https://firms.modaps.eosdis.nasa.gov/map/' },
  { name: 'Military Bases',  cat: 'Geo',       icon: '⚔️', desc: 'OpenStreetMap overlay showing military installations worldwide.', url: 'https://umap.openstreetmap.fr/en/map/military-bases-around-the-world_510207' },
  { name: 'ArcGIS Atlas',    cat: 'Geo',       icon: '🌍', desc: 'Curated global geographic information layers and analytics.', url: 'https://livingatlas.arcgis.com/en/browse/' },
  { name: 'Windy Webcams',   cat: 'Geo',       icon: '📷', desc: 'Live webcams worldwide overlaid on weather maps.', url: 'https://www.windy.com/-Webcams/webcams' },
  { name: 'Radio Garden',    cat: 'Geo',       icon: '📻', desc: 'Explore live radio stations from around the world on a 3D globe.', url: 'http://radio.garden/search' },
];

const CAT_COLOR: Record<string, string> = {
  Anonymity: '#e07a5f',
  Identity:  '#d9872e',
  Intel:     '#b48ee0',
  People:    '#6ea8e0',
  Search:    '#4fb8c4',
  CSE:       '#d9c24e',
  Geo:       '#6ec47a',
};

const CATEGORIES = ['Anonymity', 'Identity', 'Intel', 'People', 'Search', 'CSE', 'Geo'];

export function ToolsView() {
  const { c } = useContent();
  return (
    <PageShell>
      <PageHeading
        kicker={c('tools.kicker')}
        heading={c('tools.heading')}
        subheading={c('tools.subheading')}
      />

      <Panel style={{ marginBottom: 32, borderLeft: '2px solid var(--beacon)' }}>
        <p style={{ fontSize: 13.5, color: 'var(--ash)', margin: 0, lineHeight: 1.6 }}>
          {c('tools.notice')}
        </p>
      </Panel>

      {CATEGORIES.map(cat => {
        const items = TOOLS.filter(t => t.cat === cat);
        if (items.length === 0) return null;
        return (
          <section key={cat} style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: CAT_COLOR[cat], display: 'inline-block' }} />
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 15, fontWeight: 600, color: 'var(--paper)', margin: 0 }}>{cat}</h2>
            </div>
            <Panel style={{ padding: 0 }}>
              {items.map((tool, i) => (
                <Row key={tool.name} style={{ padding: '14px 18px', borderBottom: i === items.length - 1 ? 'none' : '1px solid var(--iron-soft)' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, minWidth: 0 }}>
                    <span style={{ fontSize: 18, lineHeight: 1.4, flexShrink: 0 }}>{tool.icon}</span>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--paper)' }}>{tool.name}</div>
                      <div style={{ fontSize: 13, color: 'var(--ash)', marginTop: 2 }}>{tool.desc}</div>
                    </div>
                  </div>
                  <a href={tool.url} target="_blank" rel="noopener noreferrer" style={{
                    fontSize: 13, color: CAT_COLOR[cat], textDecoration: 'none', fontWeight: 600, flexShrink: 0, marginLeft: 12,
                  }}>
                    Open →
                  </a>
                </Row>
              ))}
            </Panel>
          </section>
        );
      })}
    </PageShell>
  );
}
