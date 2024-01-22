import { Icon } from '@logbun/ui';
import { siteConfig } from '@logbun/utils';
import Link from 'next/link';

const navigation = {
  company: [
    { name: 'About', href: '/privacy' },
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
    { name: 'Data Policy', href: '/data-policy' },
  ],
  community: [
    { name: 'Docs', href: siteConfig.docs },
    { name: 'Discord', href: siteConfig.discord },
    { name: 'Github', href: siteConfig.github },
    { name: 'Twitter', href: siteConfig.twitter },
  ],
};

export default function Footer() {
  return (
    <footer className="text-gray-400 bg-gray-800">
      <div className="py-8 mx-auto container-xl lg:py-16">
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 md:grid-cols-7">
          <div className="col-span-2 shrink-0 md:col-span-3">
            <Icon className="w-auto h-10" />
            <p className="pt-8 pr-12">{siteConfig.description}</p>
          </div>
          {Object.entries(navigation).map(([key, options]) => (
            <div className="md:col-span-2">
              <h3 className="text-sm uppercase">{key}</h3>
              <ul role="list" className="mt-6 space-y-4">
                {options.map((item) => (
                  <li key={item.name}>
                    <Link href={item.href} className="text-gray-300 hover:text-white">
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </footer>
  );
}
