'use client';

import { Button, Logo } from '@logbun/ui';
import { cn } from '@logbun/utils';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { useScrollPosition } from '../hooks/useScrollPosition';

const navigation = [
  { name: 'How it works', href: '/how-it-works' },
  { name: 'Pricing', href: '/pricing' },
];

export default function Header() {
  const scrollPosition = useScrollPosition();

  const pathname = usePathname();

  const headerRef = useRef<HTMLElement | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const anchor = useMemo(() => {
    const { current } = headerRef;
    const trigger = current ? current.clientHeight : 0;
    return scrollPosition > trigger;
  }, [scrollPosition]);

  return (
    <header
      ref={headerRef}
      className={cn('bg-white', anchor ? 'border-b' : 'border-none', {
        ['sticky top-0 z-50']: !mobileMenuOpen,
      })}
    >
      <nav className="flex items-center justify-between px-6 py-3 mx-auto max-w-7xl gap-x-6 lg:px-8">
        <Link href="/" className="flex lg:flex-1">
          <Logo height={40} width={130} className="flex-shrink-0" />
        </Link>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Button
              asChild
              key={item.name}
              className={cn('text-base', {
                ['bg-gray-50']: pathname === item.href,
              })}
            >
              <Link href={item.href}>{item.name}</Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center justify-end flex-1 gap-x-4">
          <Button asChild variant="default" className="hidden text-base lg:block">
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/logins`}>Log in</Link>
          </Button>
          <Button asChild className="text-base">
            <Link href={`${process.env.NEXT_PUBLIC_APP_URL}/register`}>Get started free</Link>
          </Button>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open menu</span>
            <Menu />
          </button>
        </div>
      </nav>
    </header>
  );
}
