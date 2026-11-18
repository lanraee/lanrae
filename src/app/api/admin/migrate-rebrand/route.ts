import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('admin_token')?.value;
  if (!process.env.ADMIN_PASSWORD || token !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const updates: Record<string, string> = {
    'site.name': 'Lanrae.co.uk',
    'site.fromName': 'Lanrae.co.uk',
    'seo.title': 'Lanrae.co.uk — Super Intelligence Product Engineering',
    'seo.description': 'Engineering products for the Super Intelligence era — built, shipped, and supported by Lanrae on an adaptive AI desktop experience.',
    'seo.keywords': 'Super Intelligence, SI engineering, AI products, lanrae, AI studio, artificial intelligence, tutorials',
    'store.label': 'Featured · Engineered for SI',
    'store.heading': 'Ship-ready SI products',
    'about.heading': 'Lanrae.co.uk · SI Product Engineer',
    'about.body': 'I engineer products for the Super Intelligence era — systems that reason, act, and compound capability, not just features bolted onto a chat window. I design, build, and ship them end to end, then launch them here, on a desktop you can actually drive. lanrae.co.uk is the studio, the storefront, and the changelog, all in one.',
    'win.store.subtitle': '— SI, engineered by lanrae',
  };

  const results: string[] = [];
  for (const [key, value] of Object.entries(updates)) {
    const existing = await prisma.siteContent.findUnique({ where: { key } });
    if (existing) {
      await prisma.siteContent.update({ where: { key }, data: { value } });
      results.push(`updated ${key}: ${existing.value} → ${value}`);
    } else {
      results.push(`skipped ${key} (not in DB)`);
    }
  }

  return NextResponse.json({ ok: true, results });
}
