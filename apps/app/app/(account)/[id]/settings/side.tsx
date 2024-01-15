'use client';

import { cn } from '@logbun/utils';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';

export default function Header() {
  const path = usePathname();
  const params = useParams();

  const tabs = [
    { name: 'General', href: `/${params.id}/settings/general` },
    { name: 'Tracking', href: `/${params.id}/settings/tracking` },
  ];

  return (
    <nav className="flex flex-col space-y-1">
      {tabs.map((tab) => (
        <Link
          key={tab.name}
          href={tab.href}
          className={cn(
            path === tab.href ? 'bg-gray-100' : 'text-gray-800 hover:bg-gray-100 hover:text-gray-900',
            'rounded px-4 py-2 font-medium w-full text-sm outline-none focus:outline-none transition-colors'
          )}
        >
          {tab.name}
        </Link>
      ))}
    </nav>
  );
}
