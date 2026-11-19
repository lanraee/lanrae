'use client';

import { useEffect, useMemo, useState } from 'react';
import { useContent } from '@/lib/useContent';
import { PageShell, PageHeading, Panel, Row, Mono, Button } from '@/components/ui';
import { Checkout, type CheckoutProduct } from '@/components/Checkout';

type Product = {
  id: string;
  name: string;
  description: string;
  icon: string | null;
  price: number;
  isFree: boolean;
  isNew: boolean;
  requiresMembership: string | null;
  artifactUrl: string | null;
  githubUrl: string | null;
  showGithub: boolean;
  vercelUrl: string | null;
  gradient: string;
};

type MembershipTier = { id: string; tier: string; name: string; price: number; features: string[] };
type MemberSession = { userId: string; email: string; tier?: string; tierName?: string } | null;

type SecurityTool = {
  id: string; name: string; icon: string; category: string; language: string;
  stars: string; description: string; githubUrl: string; demoUrl: string | null; gradient: string;
};

const SECURITY_TOOLS_FALLBACK: SecurityTool[] = [
  { id: '1', name: 'Metasploit', icon: '🛡️', category: 'Exploitation', language: 'Ruby', stars: '34.2k', description: 'The world\'s most-used penetration testing framework — 2,300+ exploits across every major platform.', githubUrl: 'https://github.com/rapid7/metasploit-framework', demoUrl: null, gradient: 'linear-gradient(135deg,#7f1d1d,#5a1313)' },
  { id: '2', name: 'Nmap', icon: '🔍', category: 'Reconnaissance', language: 'C / Lua', stars: '10.1k', description: 'The iconic "Network Mapper" — port scanning, OS detection, and scripting engine used by every pentester.', githubUrl: 'https://github.com/nmap/nmap', demoUrl: 'https://nmap.org', gradient: 'linear-gradient(135deg,#1e3a8a,#1a3270)' },
  { id: '3', name: 'SQLMap', icon: '💉', category: 'Exploitation', language: 'Python', stars: '32.8k', description: 'Automatic SQL injection and database takeover tool. Supports MySQL, Oracle, PostgreSQL, MSSQL, and more.', githubUrl: 'https://github.com/sqlmapproject/sqlmap', demoUrl: null, gradient: 'linear-gradient(135deg,#7c2d12,#5e2209)' },
  { id: '4', name: 'Burp Suite', icon: '🕷️', category: 'Web Security', language: 'Java', stars: '4.2k', description: 'Industry-standard web app security platform — intercept proxy, scanner, intruder, and repeater.', githubUrl: 'https://github.com/PortSwigger/burp-extensions-montoya-api', demoUrl: 'https://portswigger.net/burp/communitydownload', gradient: 'linear-gradient(135deg,#431407,#321005)' },
  { id: '5', name: 'OWASP ZAP', icon: '🕸️', category: 'Web Security', language: 'Java', stars: '12.5k', description: 'Free, open-source web app scanner. Best for beginners and CI/CD pipeline integration.', githubUrl: 'https://github.com/zaproxy/zaproxy', demoUrl: 'https://www.zaproxy.org', gradient: 'linear-gradient(135deg,#0f3460,#0b2a52)' },
  { id: '6', name: 'Aircrack-ng', icon: '📡', category: 'Wireless', language: 'C', stars: '4.9k', description: 'Complete WiFi security auditing suite — WEP and WPA/WPA2-PSK cracking, packet capture, and injection.', githubUrl: 'https://github.com/aircrack-ng/aircrack-ng', demoUrl: 'https://aircrack-ng.org', gradient: 'linear-gradient(135deg,#3b0764,#2e0550)' },
  { id: '7', name: 'Hashcat', icon: '🔐', category: 'Password', language: 'C', stars: '21.7k', description: 'World\'s fastest password recovery. 300+ hash types, GPU-accelerated — MD5, SHA, bcrypt, and WPA2.', githubUrl: 'https://github.com/hashcat/hashcat', demoUrl: 'https://hashcat.net', gradient: 'linear-gradient(135deg,#292524,#1c1917)' },
  { id: '8', name: 'John the Ripper', icon: '🔓', category: 'Password', language: 'C', stars: '9.8k', description: 'Fast, flexible password cracker that auto-detects hash types. Supports 100+ formats out of the box.', githubUrl: 'https://github.com/openwall/john', demoUrl: null, gradient: 'linear-gradient(135deg,#422006,#321805)' },
  { id: '9', name: 'THC Hydra', icon: '🐍', category: 'Brute Force', language: 'C', stars: '10.5k', description: 'Fastest network logon cracker — 50+ protocols: FTP, HTTP, HTTPS, SMB, SSH, MySQL, and more.', githubUrl: 'https://github.com/vanhauser-thc/thc-hydra', demoUrl: null, gradient: 'linear-gradient(135deg,#14532d,#0f3d21)' },
  { id: '10', name: 'Nikto', icon: '🎯', category: 'Web Security', language: 'Perl', stars: '8.9k', description: 'Open-source web server scanner — tests for 6,700+ dangerous files, outdated software, and misconfigs.', githubUrl: 'https://github.com/sullo/nikto', demoUrl: null, gradient: 'linear-gradient(135deg,#7f1d1d,#5a1313)' },
  { id: '11', name: 'Gobuster', icon: '🚀', category: 'Reconnaissance', language: 'Go', stars: '10.2k', description: 'Blazing-fast directory, DNS, vhost, and S3 bucket enumeration tool written in Go.', githubUrl: 'https://github.com/OJ/gobuster', demoUrl: null, gradient: 'linear-gradient(135deg,#065f46,#044f3a)' },
  { id: '12', name: 'Nuclei', icon: '⚡', category: 'Vuln Scanner', language: 'Go', stars: '21.3k', description: 'Template-based vulnerability scanner with 9,000+ community templates covering CVEs, misconfigs, and more.', githubUrl: 'https://github.com/projectdiscovery/nuclei', demoUrl: 'https://nuclei.projectdiscovery.io', gradient: 'linear-gradient(135deg,#713f12,#5a320e)' },
  { id: '13', name: 'Subfinder', icon: '🌐', category: 'Reconnaissance', language: 'Go', stars: '10.4k', description: 'Passive subdomain discovery using 40+ sources — Shodan, VirusTotal, Censys, SecurityTrails, and more.', githubUrl: 'https://github.com/projectdiscovery/subfinder', demoUrl: null, gradient: 'linear-gradient(135deg,#1e3a8a,#1a3270)' },
  { id: '14', name: 'Amass', icon: '🗺️', category: 'Reconnaissance', language: 'Go', stars: '12.1k', description: 'OWASP attack surface mapping — DNS enumeration, scraping, certificate transparency, and graph analysis.', githubUrl: 'https://github.com/owasp-amass/amass', demoUrl: null, gradient: 'linear-gradient(135deg,#3b0764,#2e0550)' },
  { id: '15', name: 'BloodHound', icon: '🩸', category: 'Active Directory', language: 'TypeScript', stars: '10.7k', description: 'Reveal hidden AD attack paths using graph theory. Find the shortest route to Domain Admin.', githubUrl: 'https://github.com/BloodHoundAD/BloodHound', demoUrl: null, gradient: 'linear-gradient(135deg,#7f1d1d,#5a1313)' },
  { id: '16', name: 'Impacket', icon: '📦', category: 'Exploitation', language: 'Python', stars: '14.2k', description: 'Python library for working with network protocols — DCE/RPC, SMB, LDAP. Essential for Windows pentesting.', githubUrl: 'https://github.com/fortra/impacket', demoUrl: null, gradient: 'linear-gradient(135deg,#1e3a8a,#1a3270)' },
  { id: '17', name: 'Responder', icon: '🎣', category: 'Network', language: 'Python', stars: '5.4k', description: 'LLMNR, NBT-NS, and MDNS poisoner — captures NTLMv2 hashes transparently on local network segments.', githubUrl: 'https://github.com/lgandx/Responder', demoUrl: null, gradient: 'linear-gradient(135deg,#7c2d12,#5e2209)' },
  { id: '18', name: 'Volatility 3', icon: '🧠', category: 'Forensics', language: 'Python', stars: '2.9k', description: 'Advanced memory forensics framework. Analyse RAM dumps from Windows, Linux, and macOS systems.', githubUrl: 'https://github.com/volatilityfoundation/volatility3', demoUrl: null, gradient: 'linear-gradient(135deg,#3b0764,#2e0550)' },
  { id: '19', name: 'Wireshark', icon: '🦈', category: 'Network', language: 'C', stars: '7.3k', description: 'World\'s leading network protocol analyser — capture, inspect, and dissect traffic in real-time.', githubUrl: 'https://github.com/wireshark/wireshark', demoUrl: 'https://www.wireshark.org', gradient: 'linear-gradient(135deg,#1e3a8a,#1a3270)' },
  { id: '20', name: 'ffuf', icon: '💨', category: 'Web Security', language: 'Go', stars: '13.4k', description: 'Fuzz Faster U Fool — blindingly fast web fuzzer for directory discovery, parameter fuzzing, and vhosts.', githubUrl: 'https://github.com/ffuf/ffuf', demoUrl: null, gradient: 'linear-gradient(135deg,#065f46,#044f3a)' },
  { id: '21', name: 'PEASS-ng', icon: '🐦', category: 'Priv Escalation', language: 'Shell', stars: '16.8k', description: 'linPEAS & winPEAS — automated scripts to find local privilege escalation vectors on Linux and Windows.', githubUrl: 'https://github.com/carlospolop/PEASS-ng', demoUrl: null, gradient: 'linear-gradient(135deg,#14532d,#0f3d21)' },
  { id: '22', name: 'Sherlock', icon: '🔎', category: 'OSINT', language: 'Python', stars: '18.9k', description: 'Hunt down social media accounts by username across 400+ sites in seconds.', githubUrl: 'https://github.com/sherlock-project/sherlock', demoUrl: null, gradient: 'linear-gradient(135deg,#292524,#1c1917)' },
  { id: '23', name: 'theHarvester', icon: '🌾', category: 'OSINT', language: 'Python', stars: '11.0k', description: 'Gather emails, subdomains, hosts, and names from public sources. The go-to early-recon tool.', githubUrl: 'https://github.com/laramies/theHarvester', demoUrl: null, gradient: 'linear-gradient(135deg,#14532d,#0f3d21)' },
  { id: '24', name: 'WPScan', icon: '🔒', category: 'Web Security', language: 'Ruby', stars: '8.5k', description: 'WordPress vulnerability scanner — 36,000+ known vulnerabilities in WP core, plugins, and themes.', githubUrl: 'https://github.com/wpscanteam/wpscan', demoUrl: 'https://wpscan.com', gradient: 'linear-gradient(135deg,#7f1d1d,#5a1313)' },
  { id: '25', name: 'Mimikatz', icon: '🗝️', category: 'Credential Access', language: 'C', stars: '19.2k', description: 'Post-exploitation credential dumper — extracts plaintext passwords, hashes, and Kerberos tickets from LSASS.', githubUrl: 'https://github.com/gentilkiwi/mimikatz', demoUrl: null, gradient: 'linear-gradient(135deg,#292524,#1c1917)' },
];

const TIER_RANK: Record<string, number> = { explorer: 0, supporter: 1, insider: 2 };

export function StoreView() {
  const { c } = useContent();
  const [products, setProducts] = useState<Product[]>([]);
  const [securityTools, setSecurityTools] = useState<SecurityTool[]>(SECURITY_TOOLS_FALLBACK);
  const [memberUser, setMemberUser] = useState<MemberSession>(null);
  const [tiers, setTiers] = useState<MembershipTier[]>([]);
  const [checkout, setCheckout] = useState<CheckoutProduct | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => Array.isArray(d) && setProducts(d)).catch(() => {});
    fetch('/api/security-tools').then(r => r.json()).then(d => {
      if (Array.isArray(d) && d.length) setSecurityTools(d);
    }).catch(() => {});
    fetch('/api/member/auth').then(r => r.ok ? r.json() : null).then(setMemberUser).catch(() => setMemberUser(null));
    fetch('/api/memberships').then(r => r.json()).then(d => Array.isArray(d) && setTiers(d)).catch(() => {});
  }, []);

  const hasAccess = useMemo(() => {
    return (requiresMembership: string | null) => {
      if (!requiresMembership) return true;
      if (!memberUser?.tier) return false;
      const have = TIER_RANK[memberUser.tier.toLowerCase()] ?? -1;
      const need = TIER_RANK[requiresMembership.toLowerCase()] ?? 999;
      return have >= need;
    };
  }, [memberUser]);

  const buyProduct = (p: Product) => {
    setCheckout({ id: p.id, name: p.name, icon: p.icon, gradient: p.gradient, price: p.price, isFree: p.isFree, artifactUrl: p.artifactUrl });
  };

  const unlockTier = (tierId: string) => {
    const tier = tiers.find(t => t.tier.toLowerCase() === tierId.toLowerCase());
    setCheckout({
      id: tierId.toLowerCase(),
      name: tier ? `${tier.name} Membership` : `${tierId} Membership`,
      icon: '🪪',
      gradient: 'var(--iron)',
      price: tier?.price ?? 0,
      isFree: false,
    });
  };

  return (
    <PageShell>
      <PageHeading kicker={c('store.label')} heading={c('store.heading')} subheading={c('store.subheading')} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16, marginBottom: 64 }}>
        {products.map(p => {
          const unlocked = hasAccess(p.requiresMembership);
          const isExpanded = expanded === p.id;
          return (
            <Panel key={p.id} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ width: 40, height: 40, borderRadius: 3, display: 'grid', placeItems: 'center', fontSize: 20, background: p.gradient }}>
                  {p.icon}
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  {p.isNew && <span style={{ fontSize: 11, color: 'var(--beacon)', border: '1px solid var(--beacon-dim)', padding: '2px 7px', borderRadius: 3 }}>New</span>}
                  {p.requiresMembership && !unlocked && <span style={{ fontSize: 13 }}>🔒</span>}
                </div>
              </div>

              <div>
                <div style={{ fontSize: 16, fontWeight: 600, fontFamily: 'var(--font-display)', color: 'var(--paper)' }}>{p.name}</div>
                <p style={{
                  fontSize: 13.5, color: 'var(--ash)', marginTop: 6, lineHeight: 1.55,
                  display: isExpanded ? 'block' : '-webkit-box',
                  WebkitLineClamp: isExpanded ? 'unset' : 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                }}>
                  {p.description}
                </p>
                {p.description.length > 110 && (
                  <button onClick={() => setExpanded(isExpanded ? null : p.id)} style={{
                    background: 'none', border: 'none', color: 'var(--beacon)', fontSize: 12.5,
                    padding: 0, marginTop: 4, cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}>
                    {isExpanded ? 'Show less' : 'Read more'}
                  </button>
                )}
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, borderTop: '1px solid var(--iron-soft)' }}>
                <Mono style={{ fontSize: 14, color: 'var(--paper)' }}>
                  {p.isFree ? 'Free' : `£${(p.price / 100).toFixed(2)}`}
                </Mono>
                {p.requiresMembership && !unlocked ? (
                  <Button variant="primary" onClick={() => unlockTier(p.requiresMembership!)}>Unlock</Button>
                ) : p.requiresMembership && unlocked ? (
                  <Button variant="secondary" onClick={() => p.artifactUrl && window.open(p.artifactUrl, '_blank')}>🔓 Open</Button>
                ) : (
                  <Button variant="primary" onClick={() => buyProduct(p)}>{p.isFree ? 'Get it free' : 'Buy'}</Button>
                )}
              </div>
            </Panel>
          );
        })}
      </div>

      <section>
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 600, color: 'var(--paper)' }}>Security Toolkit</div>
          <div style={{ fontSize: 13.5, color: 'var(--ash)', marginTop: 4 }}>A reference directory of security tooling — not for sale, just useful links.</div>
        </div>
        <Panel style={{ padding: 0 }}>
          {securityTools.map((t, i) => (
            <Row key={t.id} style={{ padding: '14px 18px', borderBottom: i === securityTools.length - 1 ? 'none' : '1px solid var(--iron-soft)', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                <div style={{ fontSize: 20, flexShrink: 0 }}>{t.icon}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--paper)' }}>{t.name}</span>
                    <Mono style={{ fontSize: 11.5, color: 'var(--ash)' }}>★ {t.stars} · {t.language}</Mono>
                    <span style={{ fontSize: 11, color: 'var(--ash)', border: '1px solid var(--iron)', padding: '1px 6px', borderRadius: 3 }}>{t.category}</span>
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ash)', marginTop: 4, lineHeight: 1.5 }}>{t.description}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, flexShrink: 0 }}>
                <a href={t.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--beacon)', textDecoration: 'none' }}>GitHub</a>
                {t.demoUrl && <a href={t.demoUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, color: 'var(--beacon)', textDecoration: 'none' }}>Demo</a>}
              </div>
            </Row>
          ))}
        </Panel>
      </section>

      <Checkout product={checkout} onClose={() => setCheckout(null)} />
    </PageShell>
  );
}
