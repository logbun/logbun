export const siteConfig = {
  title: 'Logbun',
  url: 'https://logbun.com',
  description: 'Simple, Open Source, Privacy-Friendly javascript error tracking for SaaS founders who ship fast.',
};

export const defaultMetadata = {
  title: {
    template: `%s | ${siteConfig.title}`,
    default: `${siteConfig.title} | ${siteConfig.description}`,
  },
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export const twitter = {
  title: siteConfig.title,
  description: siteConfig.description,
  card: 'summary_large_image',
  images: [{ url: `${siteConfig.url}/og.png`, alt: siteConfig.title }],
};

export const openGraph = {
  title: siteConfig.title,
  description: siteConfig.description,
  type: 'website',
  images: [{ url: `${siteConfig.url}/og.png`, alt: siteConfig.title }],
  siteName: siteConfig.title,
};
