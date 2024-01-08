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
    <nav className="flex py-4 -mb-px -ml-3 space-x-1">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={cn(
            path.endsWith(tab.href) ? 'bg-gray-200' : 'text-gray-600 hover:text-gray-800',
            'rounded px-3 py-1.5 font-medium'
          )}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
