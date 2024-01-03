'use client';

import { Menu, Transition } from '@headlessui/react';
import { Icon } from '@logbun/ui';
import { cn, errorMessage } from '@logbun/utils';
import { Book, LayoutList, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Gravatar from 'react-gravatar';
import { toast } from 'sonner';

const navigation = [
  { icon: LayoutList, name: 'Projects', href: '/' },
  { icon: Book, name: 'Docs', href: '/docs' },
  { icon: Settings, name: 'Settings', href: '/settings' },
];

const settings = [{ name: 'Billing', href: '/billing' }];

interface Props {
  email: string;
}

export default function Nav({ email }: Props) {
  const router = useRouter();

  const pathname = usePathname();

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
    <nav className="flex items-center justify-between w-full px-4 py-3 text-gray-500">
      <Link className="flex" href="/">
        <Icon className="w-auto h-7" />
      </Link>

      <div
        className="flex items-center justify-between flex-1 px-4"
        style={{
          ['--max-width' as string]: '56rem',
          ['--offset' as string]: 'calc((100% - var(--max-width)) / 2)',
          maxWidth: 'calc(var(--max-width) + var(--offset))',
        }}
      >
        <div className="flex items-center space-x-5">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-1 text-sm font-medium transition-colors',
                pathname.endsWith(item.href) ? 'text-gray-900 hover:text-gray-500' : 'text-gray-500 hover:text-gray-900'
              )}
            >
              <item.icon size={18} />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>
        <Menu as="div" className="relative">
          <Menu.Button className="relative flex items-center max-w-xs text-sm rounded-full focus:outline-none">
            <Gravatar className="rounded-full w-7 h-7" rating="pg" default="retro" email={email} />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-200"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 p-2 mt-2 text-sm origin-top-right bg-white rounded-md shadow-lg ring-1 ring-opacity-5 ring-gray-500 w-52 shadow-gray-200 focus:outline-none">
              {settings.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={cn(active ? 'bg-gray-100' : '', 'block px-2 py-1.5 text-gray-500 rounded-md')}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    className={cn('block w-full px-2 py-1.5 text-left rounded-md', {
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
    </nav>
  );
}
