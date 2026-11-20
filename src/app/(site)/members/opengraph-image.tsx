import { ImageResponse } from 'next/og';
import { buildOgImage, ogImageSize, ogImageContentType } from '@/lib/ogImage';

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return new ImageResponse(
    buildOgImage({
      eyebrow: 'Join the studio',
      heading: 'Members',
      tagline: 'Back the build and get the perks. Members fund what gets built next.',
      path: '/members',
    }),
    { width: 1200, height: 630 },
  );
}
