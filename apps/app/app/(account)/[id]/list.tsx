'use client';

import SearchIcon from '@logbun/app/assets/illustrations/search.svg';
import { EventResponse } from '@logbun/app/types';
import Logbun from '@logbun/js';
import { Button, buttonVariants } from '@logbun/ui';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { toast } from 'sonner';

interface EventResultResponse extends EventResponse {
  count: number;
  createdAt: string;
  updatedAt: string;
  aggregate: string[];
}
interface Props {
  events: EventResultResponse[];
}

const emojis = {
  fatal: '💀',
  error: '❌',
  warning: '⚠️',
  log: '📝',
  info: 'ℹ️',
  debug: '🔍',
} as const;

export default function List({ events }: Props) {
  const pathname = usePathname();

  const instance = useRef<typeof Logbun>();

  const router = useRouter();

  useEffect(() => {
    instance.current = Logbun.init({
      apiKey: 'YOUR_API_KEY',
      endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/event' : undefined,
    });
  });

  const sendSampleEvent = () => {
    if (!instance.current) return null;

    instance.current.notify('This is a test event', {
      afterNotify: () => {
        router.refresh();
        toast.success('Sample event sent');
      },
    });
  };

  return (
    <>
      {!events.length && (
        <div className="flex flex-col items-center justify-center space-y-1">
          <Image src={SearchIcon} alt="files" className="w-32 h-32" />
          <h6 className="flex items-center py-3 space-x-2">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full bg-yellow-400 rounded-full opacity-75 animate-ping"></span>
              <span className="relative inline-flex w-3 h-3 scale-75 bg-yellow-500 rounded-full"></span>
            </span>
            <span>Waiting for your first issue event</span>
          </h6>
          <Link href={`${pathname}/settings/tracking`} className={buttonVariants()}>
            Installation instructions {'->'}
          </Link>
          <Button onClick={sendSampleEvent} variant="default" size="small">
            Create sample event
          </Button>
        </div>
      )}
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0">
                    Name
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Title
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Status
                  </th>
                  <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                    Role
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {events.map((person) => (
                  <tr key={person.id}>
                    <td className="py-5 pl-4 pr-3 text-sm whitespace-nowrap sm:pl-0">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-11 w-11">
                          {/* <img className="rounded-full h-11 w-11" src={person.name} alt="" /> */}
                          <div className="flex items-center justify-center text-lg bg-gray-200 rounded-full h-11 w-11">
                            {person.level ? emojis[person.level] : null}
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">{person.message}</div>
                          <div className="mt-1 text-gray-500">{person.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                      <div className="text-gray-900">{person.fingerprint}</div>
                      <div className="mt-1 text-gray-500">{person.count}</div>
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-700 rounded-md bg-green-50 ring-1 ring-inset ring-green-600/20">
                        {person.aggregate}
                      </span>
                    </td>
                    <td className="px-3 py-5 text-sm text-gray-500 whitespace-nowrap">
                      {person.createdAt}/{person.updatedAt}
                    </td>
                    <td className="relative py-5 pl-3 pr-4 text-sm font-medium text-right whitespace-nowrap sm:pr-0">
                      <a href="#" className="text-indigo-600 hover:text-indigo-900">
                        Edit<span className="sr-only">, {person.name}</span>
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {events.map((event) => (
        <div key={event.id}>{event.name}</div>
      ))}
    </>
  );
}
