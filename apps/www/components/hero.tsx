import { Button } from '@logbun/ui';
import { site } from '@logbun/utils';
import Image from 'next/image';
import Link from 'next/link';

import Javascript from '@logbun/ui/assets/platforms/javascript.svg';
import NextJs from '@logbun/ui/assets/platforms/next.svg';
import NodeJs from '@logbun/ui/assets/platforms/node.svg';
import ReactJs from '@logbun/ui/assets/platforms/react.svg';

import dashboard from '@logbun/ui/assets/main/dashboard.png';
import { Sparkles } from 'lucide-react';

export const platforms = [
  { name: 'Javascript', icon: Javascript },
  { name: 'React', icon: ReactJs },
  { name: 'Next.JS', icon: NextJs },
  { name: 'Node.JS', icon: NodeJs },
];

export default function Hero() {
  return (
    <div className="py-12 sm:py-16 lg:pb-20">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="mx-auto text-center" style={{ maxWidth: '50rem' }}>
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Simple, open-source, privacy-first <span style={{ color: '#e3af0e' }}>Sentry.io alternative</span>
          </h1>

          <p className="mt-6 text-xl leading-8 text-gray-500">
            <span className="inline lg:block">
              GDPR & CCPA compliant lightweight error tracking for{' '}
              <span className="font-semibold text-gray-900">SaaS founders</span>.
            </span>
            <span className="inline lg:block"> No cookies or IP tracking. Hosted in the 🇪🇺 European Union</span>
          </p>

          <div className="flex items-center justify-center mt-10 gap-x-6">
            <Button
              asChild
              variant="primary"
              className="text-base"
              size="large"
              icon={<Sparkles size={18} />}
              iconPosition="end"
            >
              <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/register`}>Early Access</Link>
            </Button>
            <Button
              icon={
                <svg width={24} height={24} fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              asChild
              variant="secondary"
              className="text-base"
              size="large"
            >
              <a target="_blank" href={site.github}>
                Star on Github
              </a>
            </Button>
          </div>
          <div className="hidden">
            <div className="flex items-center justify-center mt-8 gap-x-2">
              {platforms.map((platform) => (
                <Image
                  src={platform.icon}
                  alt={platform.name}
                  width={32}
                  height={32}
                  className="overflow-hidden rounded"
                />
              ))}
            </div>
          </div>
        </div>
        <div className="flow-root mt-8 sm:mt-12">
          <Image src={dashboard} alt="App screenshot" width={2432} height={1442} />
        </div>
      </div>
    </div>
  );
}
