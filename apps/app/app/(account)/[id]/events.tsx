'use client';

import SearchIcon from '@logbun/app/assets/illustrations/search.svg';
import { EventResultResponse, Project } from '@logbun/app/types';
import Logbun from '@logbun/js';
import { Button, buttonVariants } from '@logbun/ui';
import { cn } from '@logbun/utils';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';

const emojis = {
  fatal: { icon: '💀', bg: 'bg-gray-100' },
  error: { icon: '❌', bg: 'bg-red-100' },
  warning: { icon: '⚠️', bg: 'bg-yellow-100' },
  log: { icon: '📝', bg: 'bg-gray-100' },
  info: { icon: 'ℹ️', bg: 'bg-blue-100' },
  debug: { icon: '🔍', bg: 'bg-gray-100' },
} as const;

interface Props {
  project: Project;
  events: EventResultResponse[];
}

export default function Events({ project, events }: Props) {
  const pathname = usePathname();

  const router = useRouter();

  const sendSampleEvent = () => {
    const instance = Logbun.init({
      apiKey: project.apiKey,
      endpoint: process.env.NODE_ENV === 'development' ? 'http://localhost:8000/event' : undefined,
    });

    // undefinedFunction();
    // router.refresh();
    // toast.success('Sample event sent');

    instance.notify('This is a test event', {
      afterNotify: () => {
        router.refresh();
        toast.success('Sample event sent');
      },
    });
  };

  return (
    <>
      {events.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Image src={SearchIcon} alt="files" className="w-32 h-32" />
          <h5 className="flex items-center py-3 space-x-2">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-amber-200 animate-ping"></span>
              <span className="relative inline-flex w-3 h-3 scale-75 rounded-full bg-amber-300"></span>
            </span>
            <span>Waiting for your first error event</span>
          </h5>
          <Link href={`${pathname}/settings/tracking`} className={buttonVariants({ className: 'my-2' })}>
            📝 Installation instructions
          </Link>
          <Button onClick={sendSampleEvent} variant="default">
            🚨 Create sample event
          </Button>
        </div>
      )}

      {events.length > 0 && (
        <>
          <div className="flex justify-between pb-5 text-xs font-medium text-gray-500 uppercase">
            <div className="flex-1 sm:flex-2">Error</div>
            <div className="flex-1">Count</div>
            <div className="flex-1">Severity</div>
            <div className="flex-1">Last Seen</div>
          </div>

          <ul role="list" className="space-y-6">
            {events.map((event) => {
              const option = event.level ? emojis[event.level] : emojis.info;

              return (
                <li key={event.fingerprint}>
                  <Link
                    href={`/${project.id}/${event.fingerprint}`}
                    className="relative transition-all hover:bg-opacity-10 flex items-center justify-between flex-1 p-3.5 bg-white rounded-lg shadow-md shadow-gray-100 ring-1 ring-gray-200/50"
                  >
                    {/* Error */}
                    <div className="flex flex-1 min-w-0 gap-x-4 sm:flex-2">
                      <div
                        className={cn(
                          'flex flex-shrink-0 items-center justify-center w-11 h-11 text-lg rounded-full bg-opacity-50',
                          option.bg
                        )}
                      >
                        {option.icon}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium truncate">{event.name}</p>
                        <p className="text-sm text-gray-500 truncate">{event.message}</p>
                      </div>
                    </div>

                    {/* Occurrences */}
                    <p className="flex-1 leading-6">{event.count}</p>

                    {/* Severity */}
                    <div className="flex-1">
                      <div
                        className={cn(
                          'rounded-full py-1 px-2 inline-flex text-xs font-medium ring-1 ring-inset',
                          event.handled
                            ? 'text-gray-600 bg-gray-50 ring-gray-500/10'
                            : 'text-red-700 bg-red-50 ring-red-600/10'
                        )}
                      >
                        {event.handled ? 'Handled' : 'Unhandled'}
                      </div>
                    </div>

                    {/* Last Seen*/}
                    <div className="flex items-center justify-between flex-1 gap-x-4">
                      <p className="leading-5 text-gray-500">
                        {formatDistanceToNow(fromUnixTime(event.updatedAt), { addSuffix: true })}
                      </p>
                      <ChevronRightIcon className="flex-none w-5 h-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </>
      )}
    </>
  );
}
