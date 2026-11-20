import { ImageResponse } from 'next/og';
import { buildOgImage, ogImageSize, ogImageContentType } from '@/lib/ogImage';

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return new ImageResponse(
    buildOgImage({
      eyebrow: 'Featured · Engineered for SI',
      heading: 'Store',
      tagline: 'Ship-ready SI products. Own them outright, or unlock the full shelf with an Insider membership.',
      path: '/store',
    }),
    { width: 1200, height: 630 },
  );
}
