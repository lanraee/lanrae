import { ImageResponse } from 'next/og';
import { buildOgImage, ogImageSize, ogImageContentType } from '@/lib/ogImage';

export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function OgImage() {
  return new ImageResponse(
    buildOgImage({
      eyebrow: 'Build with me',
      heading: 'Request a build',
      tagline: 'Got an idea? Tell lanrae what you want built — top-voted requests shape the roadmap.',
      path: '/request',
    }),
    { width: 1200, height: 630 },
  );
}
