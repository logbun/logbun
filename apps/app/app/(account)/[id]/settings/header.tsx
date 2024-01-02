'use client';

import { cn } from '@logbun/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const tabs = [
  { name: 'Account', href: '/settings/account' },
  { name: 'Preferences', href: '/settings/preferences' },
  { name: 'Tracking', href: '/settings/tracking' },
  { name: 'Payment', href: '/settings/payment' },
];

export default function Header() {
  const path = usePathname();

  return (
    <div className="border-b border-gray-200">
      <h3 className="container-sm">Settings</h3>
      <div className="mt-6 container-sm">
        <nav className="flex -mb-px space-x-3">
          {tabs.map((tab) => (
            <Link
              key={tab.name}
              href={tab.href}
              className={cn(
                'whitespace-nowrap border-b-2 px-1 pb-2 tracking-tight',
                path.endsWith(tab.href)
                  ? 'border-gray-900 text-gray-900'
                  : 'border-transparent text-gray-400 hover:text-gray-500'
              )}
            >
              {tab.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
