import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: `${process.env.NEXT_PUBLIC_WWW_URL}`,
      lastModified,
    },
  ];
}
