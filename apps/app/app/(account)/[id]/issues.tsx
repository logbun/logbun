'use client';

import SearchIcon from '@logbun/app/assets/illustrations/search.svg';
import { EventResultResponse, Project } from '@logbun/app/types';
import { getLevelEmoji } from '@logbun/app/utils';
import { Button } from '@logbun/ui';
import { cn } from '@logbun/utils';
import { formatDistanceToNow, fromUnixTime } from 'date-fns';
import { ArrowRight, ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  project: Project;
  issues: EventResultResponse[];
}

export default function Events({ project, issues }: Props) {
  const pathname = usePathname();

  return (
    <>
      {issues.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Image src={SearchIcon} alt="files" className="w-32 h-32" />
          <h5 className="flex items-center py-3 space-x-2">
            <span className="relative flex w-3 h-3">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 bg-amber-200 animate-ping"></span>
              <span className="relative inline-flex w-3 h-3 scale-75 rounded-full bg-amber-300"></span>
            </span>
            <span>Waiting for your first error event</span>
          </h5>
          <Button asChild className="my-2">
            <Link href={`${pathname}/settings/tracking`}>
              View installation instructions
              <ArrowRight size={18} />
            </Link>
          </Button>
        </div>
      )}

      {issues.length > 0 && (
        <>
          <div className="flex justify-between pb-5 text-xs font-medium text-gray-500 uppercase">
            <div className="flex-1 sm:flex-2">Error</div>
            <div className="flex-1">Count</div>
            <div className="flex-1">Severity</div>
            <div className="flex-1">Last Seen</div>
          </div>

          <ul role="list" className="space-y-6">
            {issues.map((event) => {
              const option = getLevelEmoji(event.level);

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
                          'flex flex-shrink-0 items-center justify-center w-11 h-11 text-lg rounded-full bg-opacity-50 bg-gray-100',
                          {
                            ['bg-red-100']: ['fatal', 'error'].includes(option.level),
                            ['bg-yellow-100']: option.level === 'warning',
                            ['bg-blue-100']: option.level === 'info',
                          }
                        )}
                      >
                        {option.emoji}
                      </div>
                      <div className="overflow-hidden">
                        <p className="font-medium truncate">{event.name}</p>
                        <p className="text-sm text-gray-500 truncate">{event.message}</p>
                      </div>
                    </div>

                    {/* Occurrences */}
                    <p className="flex-1 leading-6">
                      {event.count} {event.sign}
                    </p>

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
