'use client';

import { Menu, Transition } from '@headlessui/react';
import { Logo } from '@logbun/ui';
import { cn, errorMessage } from '@logbun/utils';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Fragment } from 'react';
import Gravatar from 'react-gravatar';
import { toast } from 'sonner';

const settings = [
  { name: 'Projects', href: '/projects' },
  // { name: 'Settings', href: '/settings' },
  // { name: 'Billing', href: '/billing' },
];

interface Props {
  email: string;
}

export default function Nav({ email }: Props) {
  const router = useRouter();

  const handleSignOut = async () => {
    const id = toast.loading('Signing out...');

    try {
      await signOut({ redirect: false });
      router.refresh();
      toast.dismiss(id);
    } catch (error) {
      toast.error(errorMessage(error));
    }
  };

  return (
    <nav className="border-b">
      <div className="flex items-center justify-between h-16 container-lg">
        <Link className="flex outline-none focus:outline-none" href="/projects">
          <Logo className="w-auto h-8" />
        </Link>

        <Menu as="div" className="relative -mr-2">
          <Menu.Button className="relative flex items-center max-w-xs px-2 py-1.5 space-x-3 transition-colors rounded-md hover:bg-gray-100 focus:outline-none">
            <span className="truncate">{email}</span>
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
            <Menu.Items className="absolute right-0 z-10 py-2 mt-2 font-normal origin-top-right bg-white rounded-md shadow-lg w-60 ring-1 ring-black ring-opacity-5 focus:outline-none">
              {settings.map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      href={item.href}
                      className={cn(active ? 'bg-gray-100' : 'text-gray-700', 'block px-3.5 py-1.5')}
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
                    className={cn('block w-full px-3.5 py-1.5 text-left', {
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
