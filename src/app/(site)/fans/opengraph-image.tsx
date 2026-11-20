import { ImageResponse } from 'next/og';
import { buildOgImage, ogImageSize, ogImageContentType } from '@/lib/ogImage';

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return new ImageResponse(
    buildOgImage({
      eyebrow: 'Hall of fame',
      heading: 'Fans',
      tagline: 'The people funding the future. Ranked by total support.',
      path: '/fans',
    }),
    { width: 1200, height: 630 },
  );
}
