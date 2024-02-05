'use client';

import { cn } from '@logbun/utils/client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  list: { name: string; href: string }[];
}

export default function SideBar({ list }: Props) {
  const path = usePathname();

  return (
    <nav className="flex flex-col space-y-1">
      {list.map((tab) => (
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
