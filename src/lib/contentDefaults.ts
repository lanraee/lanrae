/* Shared CMS fallback defaults — single source of truth.
   Mirrors src/app/api/content's SiteContent overrides; see admin/page.tsx for the editor.
   Organized by page/section so the admin Content tab can group fields the same way. */
export const CONTENT_DEFAULTS: Record<string, string> = {
  // Site / SEO
  'site.logoUrl': '/logo.png',
  'site.name': 'Lanrae.co.uk',

  // Nav + Footer (shared across every page)
  'nav.store.label': 'Store',
  'nav.members.label': 'Members',
  'nav.blog.label': 'Blog',
  'nav.fans.label': 'Fans',               'nav.fans.desc': 'Leaderboard of top supporters',
  'nav.request.label': 'Request a build', 'nav.request.desc': 'Pitch what gets built next',
  'nav.support.label': 'Support',         'nav.support.desc': 'Send a one-off tip',
  'nav.about.label': 'About',             'nav.about.desc': 'Who’s building this',
  'nav.trove.label': 'TroveAgent',        'nav.trove.desc': 'AI build assistant',
  'nav.tools.label': 'WhiteHat Tools',    'nav.tools.desc': 'OSINT & security directory',
  'nav.radio.label': 'Radio',             'nav.radio.desc': 'Live radio + playlist',
  'nav.play.label': 'Snake',              'nav.play.desc': 'A quick break',
  'nav.browser.label': 'Browser',         'nav.browser.desc': 'Bookmarked links',
  'footer.tagline': 'lanrae.co.uk — built, shipped, and maintained by one person.',

  // Home
  'home.hero.heading': 'I build what I ship.',
  'home.hero.body': 'I engineer products for the Super Intelligence era, then sell, support, and document them here — the studio, the storefront, and the changelog, all in one place.',
  'home.hero.cta1': 'Browse the store',
  'home.hero.cta2': 'Read the build log',
  'home.manifest.heading': 'Manifest',
  'home.manifest.store.desc': 'Products you can own outright, or unlock with membership.',
  'home.manifest.members.desc': 'Fund what gets built next. Three tiers, real perks.',
  'home.manifest.fans.desc': 'Who’s backing the build this month.',
  'home.manifest.request.desc': 'Pitch what you want built next.',
  'home.manifest.support.desc': 'Send a one-off tip — straight into the next build.',
  'home.manifest.about.desc': 'Who’s building this, and why.',
  'home.alsohere.label': 'Also here:',
  'home.blog.heading': 'Latest from the build log',

  // Store
  'store.label': 'Featured · Engineered for SI',
  'store.heading': 'Ship-ready SI products',
  'store.subheading': 'Own them outright, or unlock the full shelf with an Insider membership.',

  // Fans
  'fans.label': 'Hall of fame',
  'fans.heading': 'The people funding the future',
  'fans.subheading': 'Ranked by total support. Resets monthly.',

  // Members
  'members.label': 'Join the studio',
  'members.heading': 'Back the build. Get the perks.',
  'members.subheading': 'Members fund what gets built next and top supporters get their name on the wall.',

  // Request
  'request.label': 'Build with me',
  'request.heading': 'Request a project',
  'request.subheading': 'Got an idea? Tell me what you want built — top-voted requests shape the roadmap.',

  // Support
  'donate.label': 'One-off tip',
  'donate.heading': 'Buy me a GPU hour ☕',
  'donate.subheading': 'Every tip goes straight into building the next product.',

  // About
  'about.heading': 'lanrae · SI Product Engineer',
  'about.body': 'I engineer products for the Super Intelligence era — systems that reason, act, and compound capability, not just features bolted onto a chat window. I design, build, and ship them end to end, then launch them here, on a desktop you can actually drive. lanrae.co.uk is the studio, the storefront, and the changelog, all in one.',

  // Profile
  'profile.login.heading': 'Sign in',
  'profile.login.subheading': 'Sign in with the email tied to your membership.',
  'win.profile.title': 'Member Profile', 'win.profile.subtitle': '',

  // TroveAgent
  'trove.kicker': 'AI Assistant / Agent',
  'trove.heading': 'TroveAgent',
  'trove.welcome': 'Hi! I’m TroveAgent — your AI design & development assistant. Ask me about UI/UX, branding, typography, colour systems, code, or anything else.',
  'win.troveagent.title': 'TroveAgent', 'win.troveagent.subtitle': '— AI Assistant / Agent',

  // WhiteHat Tools
  'tools.kicker': 'OSINT4ALL · Recon tools',
  'tools.heading': 'WhiteHat Tools',
  'tools.subheading': 'A curated directory of OSINT, anonymity, and reconnaissance tools.',
  'tools.notice': 'Educational and research use only. These tools are linked for learning OSINT and security research — use them within the law and with consent.',

  // Snake
  'play.kicker': 'Classic Nokia',
  'play.heading': 'Snake',
  'play.subheading': 'A quick break. Arrow keys, WASD, or the D-pad.',

  // Browser
  'browser.kicker': 'Bookmarks',
  'browser.heading': 'Browser',
  'browser.subheading': 'A small in-page browser with a few favourites.',

  // Radio
  'radio.kicker': 'Music',
  'radio.heading': 'Radio',
  'radio.subheading': 'Live internet radio, or a playlist — your call.',

  // Blog
  'blog.kicker': 'Tutorials & build log',
  'blog.heading': 'Build things. Share what you learn.',
  'blog.subheading': 'Tutorials, devlogs, and guides from building real things — networking, AI, dev tools, and more.',

  // Media embeds
  'spotify.embedUrl': 'https://open.spotify.com/embed/playlist/5lKfoFXeyYe3aJCOvmubp9?utm_source=generator&si=ea24e6827ef144de',
};
