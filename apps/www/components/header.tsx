'use client';

import { Button, Dialog, Logo } from '@logbun/ui';
import { cn, site } from '@logbun/utils';
import { ArrowRight, Menu } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMemo, useRef, useState } from 'react';
import { useScrollPosition } from '../hooks/useScrollPosition';

const navigation = [
  // { name: 'How it works', href: '/' },
  // { name: 'Pricing', href: '/' },
  { name: 'Docs', href: site.docs },
  { name: 'Community', href: site.discord },
] as const;

const actions = [
  { name: 'Log in', href: `${process.env.NEXT_PUBLIC_APP_URL}/login` },
  { name: 'Early Access', href: `${process.env.NEXT_PUBLIC_APP_URL}/register` },
] as const;

export default function Header() {
  const scrollPosition = useScrollPosition();

  const pathname = usePathname();

  const headerRef = useRef<HTMLElement | null>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [login, register] = actions;

  const anchor = useMemo(() => {
    const { current } = headerRef;
    const trigger = current ? current.clientHeight : 0;
    return scrollPosition > trigger;
  }, [scrollPosition]);

  return (
    <header
      ref={headerRef}
      className={cn(anchor ? 'border-b' : 'border-none', {
        ['sticky bg-gray-50 top-0 z-50']: !mobileMenuOpen,
      })}
    >
      <nav
        className={cn(
          'flex transition-all duration-500 items-center justify-between py-6 mx-auto container-xl gap-x-6',
          {
            ['py-3']: anchor,
          }
        )}
      >
        <Link href="/" className="flex lg:flex-1">
          <Logo height={40} width={160} className="flex-shrink-0" />
        </Link>
        <div className="hidden lg:flex lg:gap-x-8">
          {navigation.map((item) => (
            <Button
              asChild
              key={item.name}
              variant="default"
              className={cn('text-base font-normal -mx-3 py-1.5', {
                ['bg-gray-50']: pathname === item.href,
              })}
            >
              <Link target={item.href.includes('https') ? '_blank' : undefined} href={item.href}>
                {item.name}
              </Link>
            </Button>
          ))}
        </div>
        <div className="flex items-center justify-end flex-1 gap-x-4">
          <Button asChild variant="default" className="hidden text-base font-normal lg:block">
            <Link href={login.href}>{login.name}</Link>
          </Button>
          <Button asChild variant="primary" className="text-base" icon={<ArrowRight size={18} />} iconPosition="end">
            <Link href={register.href}>{register.name}</Link>
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
      <div className="lg:hidden">
        <Dialog open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <Dialog.Content className="top-0 left-0 -translate-x-0 -translate-y-0">
            <Link href="/">
              <Logo height={40} width={140} />
            </Link>
            <div className="divide-y divide-gray-200">
              <div className="py-3 space-y-1">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 -mx-3 text-gray-500 rounded hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="pt-3 space-y-1">
                {actions.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="-mx-3 block rounded py-1.5 px-3 text-gray-500 hover:bg-gray-100"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </Dialog.Content>
        </Dialog>
      </div>
    </header>
  );
}
