import { EventResultResponse } from '@logbun/app/types';
import { cn } from '@logbun/utils';
import { formatDistance } from 'date-fns';
import { ChevronRightIcon } from 'lucide-react';

const emojis = {
  fatal: { icon: '💀', bg: 'bg-gray-100' },
  error: { icon: '❌', bg: 'bg-red-100' },
  warning: { icon: '⚠️', bg: 'bg-yellow-100' },
  log: { icon: '📝', bg: 'bg-gray-100' },
  info: { icon: 'ℹ️', bg: 'bg-blue-100' },
  debug: { icon: '🔍', bg: 'bg-gray-100' },
} as const;

interface Props {
  events: EventResultResponse[];
}

export default function Events({ events }: Props) {
  return (
    <>
      <div className="flex justify-between py-5 text-xs font-medium text-gray-500 uppercase">
        <div className="flex-1 sm:flex-2">Error</div>
        <div className="flex-1">Occurrences</div>
        <div className="flex-1">Severity</div>
        <div className="flex-1">Last Seen</div>
      </div>

      <ul role="list" className="space-y-6">
        {events.map((event) => {
          const option = event.level ? emojis[event.level] : emojis.info;

          return (
            <li
              key={event.fingerprint}
              className="relative flex items-center justify-between flex-1 p-3.5 bg-white rounded-xl shadow-md shadow-gray-100 ring-1 ring-gray-200/50"
            >
              {/* Error */}
              <div className="flex flex-1 gap-x-4 sm:flex-2">
                <div
                  className={cn(
                    'flex items-center justify-center w-11 h-11 text-lg rounded-full bg-opacity-50',
                    option.bg
                  )}
                >
                  {option.icon}
                </div>
                <div className="truncate">
                  <p className="font-medium truncate">{event.message}</p>
                  <p className="text-sm text-gray-500 truncate">{event.name}</p>
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
                  {formatDistance(new Date(event.updatedAt), new Date(), { addSuffix: true })}
                </p>
                <ChevronRightIcon className="flex-none w-5 h-5 text-gray-400" aria-hidden="true" />
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
