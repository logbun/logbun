export const siteConfig = {
  title: 'Logbun',
  url: 'https://logbun.com',
  description: 'Simple, open-source, privacy-friendly JavaScript error tracking for SaaS founders who ship fast.',

  docs: 'https://www.notion.so/meekscreativelab/Logbun-Docs-a525cb5539c341abba551121edaec4c0?pvs=4',
  discord: 'https://discord.gg/nhVEnBbB',
  twitter: 'https://twitter.com/logbunhq',
  github: 'https://github.com/logbun/logbun',
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
