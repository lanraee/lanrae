import { ImageResponse } from 'next/og';
import { buildOgImage, ogImageSize, ogImageContentType } from '@/lib/ogImage';

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return new ImageResponse(
    buildOgImage({
      eyebrow: 'About',
      heading: 'lanrae',
      tagline: 'SI Product Engineer — who’s building lanrae.co.uk, and why.',
      path: '/about',
    }),
    { width: 1200, height: 630 },
  );
}
