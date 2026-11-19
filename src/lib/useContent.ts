'use client';

import { useEffect, useState } from 'react';
import { CONTENT_DEFAULTS } from '@/lib/contentDefaults';

/** Fetches CMS overrides (GET /api/content) and returns a `c(key)` getter that
 *  falls back to CONTENT_DEFAULTS, matching the lookup every page's copy uses. */
export function useContent() {
  const [content, setContent] = useState<Record<string, string>>({});

  useEffect(() => {
    fetch('/api/content').then(r => r.json()).then(setContent).catch(() => {});
  }, []);

  const c = (key: string) => content[key] ?? CONTENT_DEFAULTS[key] ?? '';
  return { c, content };
}
