import { ImageResponse } from 'next/og';
import { buildOgImage, ogImageSize, ogImageContentType } from '@/lib/ogImage';

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return new ImageResponse(
    buildOgImage({
      eyebrow: 'One-off tip',
      heading: 'Support',
      tagline: 'Buy lanrae a GPU hour. Every tip goes straight into building the next product.',
      path: '/support',
    }),
    { width: 1200, height: 630 },
  );
}
