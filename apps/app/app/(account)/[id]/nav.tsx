'use client';

import { Menu, Transition } from '@headlessui/react';
import { Logo } from '@logbun/ui';
import { cn, errorMessage } from '@logbun/utils';
import { ChevronDown, CircleUserRound } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import { toast } from 'sonner';

const navigation = [
  { name: 'Settings', href: '/settings' },
  { name: 'Billing', href: '/billing' },
];

export default function Nav() {
  const router = useRouter();

  const handleSignOut = async () => {
    const id = toast.loading('Signing out...');
    try {
      signOut();
      router.refresh();
      router.push('/');
      toast.dismiss(id);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <div className="flex items-center justify-between h-24">
      <Link className="flex" href="/">
        <Logo className="w-auto h-8" />
      </Link>
      <Menu as="div" className="relative">
        <Menu.Button className="relative flex items-center max-w-xs text-sm rounded-full focus:outline-none">
          <CircleUserRound size={34} strokeWidth={1.3} />
          <ChevronDown size={20} strokeWidth={2.1} />
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-150"
          enterFrom="opacity-70 translate-y-0"
          enterTo="opacity-100 translate-y-1"
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100 translate-y-1"
          leaveTo="opacity-70 translate-y-0"
        >
          <Menu.Items className="absolute right-0 z-10 py-1 mt-2 text-sm origin-top-right bg-white rounded-md shadow-lg w-52 ring-1 ring-black ring-opacity-5 focus:outline-none">
            {navigation.map((item) => (
              <Menu.Item key={item.name}>
                {({ active }) => (
                  <Link href={item.href} className={cn(active ? 'bg-slate-100' : '', 'block px-4 py-2 text-slate-700')}>
                    {item.name}
                  </Link>
                )}
              </Menu.Item>
            ))}
            <Menu.Item>
              {({ active }) => (
                <button
                  type="button"
                  className={cn('block w-full px-4 py-2 text-left', {
                    ['bg-red-500 bg-opacity-10 text-red-500']: active,
                    ['text-red-400']: !active,
                  })}
                  onClick={handleSignOut}
                >
                  Sign out
                </button>
              )}
            </Menu.Item>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
