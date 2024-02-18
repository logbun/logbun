'use client';

import { Button, DropdownMenu, Logo } from '@logbun/ui';
import { errorMessage, site } from '@logbun/utils';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Gravatar from 'react-gravatar';
import { toast } from 'sonner';

const settings = [
  { name: 'Projects', href: '/projects' },
  { name: 'Profile', href: '/settings/profile' },
];

interface Props {
  name: string;
  email: string;
}

type NotificationValue = 'show' | 'hide';

const notificationKey = 'discord-notification';

export default function Nav({ name, email }: Props) {
  const router = useRouter();

  const [notification, setNotification] = useState<NotificationValue>('hide');

  useEffect(() => {
    const value = localStorage.getItem(notificationKey) as NotificationValue;
    updateNotification(value || 'show');
  }, []);

  const updateNotification = (value: NotificationValue) => {
    setNotification(value);
    localStorage.setItem(notificationKey, value);
  };

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

        <div className="flex items-center justify-center space-x-4">
          <a
            href={site.discord}
            onClick={() => updateNotification('hide')}
            target="_blank"
            className="relative w-7 h-7"
          >
            {notification === 'hide' ? null : (
              <span className="absolute -top-0.5 -right-0.5">
                <span className="relative flex w-2 h-2">
                  <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-rose-400 animate-ping"></span>
                  <span className="relative inline-flex w-2 h-2 rounded-full bg-rose-500"></span>
                </span>
              </span>
            )}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              stroke="currentColor"
              strokeWidth="0"
              className="cursor-pointer hover:text-indigo-600"
              color="#586AEA"
              viewBox="0 0 16 16"
            >
              <path d="M6.552 6.712c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888.008-.488-.36-.888-.816-.888zm2.92 0c-.456 0-.816.4-.816.888s.368.888.816.888c.456 0 .816-.4.816-.888s-.36-.888-.816-.888z"></path>
              <path d="M13.36 0H2.64C1.736 0 1 .736 1 1.648v10.816c0 .912.736 1.648 1.64 1.648h9.072l-.424-1.48 1.024.952.968.896L15 16V1.648C15 .736 14.264 0 13.36 0zm-3.088 10.448s-.288-.344-.528-.648c1.048-.296 1.448-.952 1.448-.952-.328.216-.64.368-.92.472-.4.168-.784.28-1.16.344a5.604 5.604 0 01-2.072-.008 6.716 6.716 0 01-1.176-.344 4.688 4.688 0 01-.584-.272c-.024-.016-.048-.024-.072-.04-.016-.008-.024-.016-.032-.024-.144-.08-.224-.136-.224-.136s.384.64 1.4.944c-.24.304-.536.664-.536.664-1.768-.056-2.44-1.216-2.44-1.216 0-2.576 1.152-4.664 1.152-4.664 1.152-.864 2.248-.84 2.248-.84l.08.096c-1.44.416-2.104 1.048-2.104 1.048s.176-.096.472-.232c.856-.376 1.536-.48 1.816-.504.048-.008.088-.016.136-.016a6.521 6.521 0 014.024.752s-.632-.6-1.992-1.016l.112-.128s1.096-.024 2.248.84c0 0 1.152 2.088 1.152 4.664 0 0-.68 1.16-2.448 1.216z"></path>
            </svg>
          </a>

          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="default" className="-mr-2 space-x-3 text-base font-normal">
                <span className="truncate">{name}</span>
                <Gravatar className="rounded-full w-7 h-7" rating="pg" default="retro" email={email} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content className="w-60" align="end" forceMount>
              <DropdownMenu.Label className="font-normal">
                <p className="text-base font-medium truncate">{name}</p>
                <p className="text-sm text-gray-500 truncate">{email}</p>
              </DropdownMenu.Label>
              <DropdownMenu.Separator />
              <DropdownMenu.Group>
                {settings.map((item) => (
                  <DropdownMenu.Item key={item.name} asChild>
                    <Link href={item.href}>{item.name}</Link>
                  </DropdownMenu.Item>
                ))}
              </DropdownMenu.Group>
              <DropdownMenu.Separator />
              <DropdownMenu.Item asChild>
                <button type="button" className="w-full text-red-500 hover:text-red-600" onClick={handleSignOut}>
                  Sign out
                </button>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
