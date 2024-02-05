'use client';

import { EventResultResponse } from '@logbun/app/types';
import { Button } from '@logbun/ui';
import { errorMessage } from '@logbun/utils';
import { cn } from '@logbun/utils/client';
import { format, fromUnixTime } from 'date-fns';
import { CheckCircle2, ChevronLeft, Fingerprint, Monitor, Smartphone, Tablet, XCircle } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';

import Brave from '@logbun/app/assets/browsers/brave.svg';
import Chrome from '@logbun/app/assets/browsers/chrome.svg';
import Edge from '@logbun/app/assets/browsers/edge.svg';
import Firefox from '@logbun/app/assets/browsers/firefox.svg';
import Safari from '@logbun/app/assets/browsers/safari.svg';

import { toggleEventResolved } from '@logbun/app/actions';
import Android from '@logbun/app/assets/os/AND.png';
import Linux from '@logbun/app/assets/os/LIN.png';
import Mac from '@logbun/app/assets/os/MAC.png';
import Ubuntu from '@logbun/app/assets/os/UBT.png';
import Windows from '@logbun/app/assets/os/WIN.png';
import { useTransition } from 'react';
import { toast } from 'sonner';

interface Props {
  event: EventResultResponse;
}

const browsers = {
  Chrome,
  Brave,
  Edge,
  Firefox,
  Safari,
} as const;

const oss = {
  Android,
  Linux,
  'Mac OS': Mac,
  Ubuntu,
  Windows,
} as const;

const devices = {
  desktop: <Monitor size={20} />,
  tablet: <Tablet size={20} />,
  mobile: <Smartphone size={20} />,
} as const;

export default function Header({ event }: Props) {
  const params = useParams();

  let [isPending, startTransition] = useTransition();

  const browser = event.browser as unknown as keyof typeof browsers;

  const os = event.os as unknown as keyof typeof oss;

  const device = event.device as unknown as keyof typeof devices;

  const options = {
    browser: browsers[browser],
    os: oss[os],
    device: devices[device],
  };

  const onResolve = async () => {
    startTransition(async () => {
      try {
        await toggleEventResolved(event.fingerprint);
      } catch (error) {
        toast.error(errorMessage(error));
      }
    });
  };

  const Unknown = () => <div className="w-8 h-8 bg-gray-300 rounded-full" />;

  return (
    <>
      <div className="flex items-center justify-between pt-8 pb-3">
        <Link className="inline-flex items-center text-gray-500 hover:text-gray-600" href={`/${params.id}`}>
          <ChevronLeft size={18} />
          <span>All errors</span>
        </Link>
        <div className="flex items-center text-gray-500 gap-x-1">
          <Fingerprint size={16} />
          <span>{event.fingerprint}</span>
        </div>
      </div>

      <div className="flex items-center justify-between pb-5 border-b">
        <div>
          <h3>{event.name}</h3>
          <p className="text-gray-500">{event.message}</p>
        </div>
        <Button
          loading={isPending}
          onClick={onResolve}
          size="small"
          variant={event.resolved ? 'secondary' : 'primary'}
          icon={event.resolved ? <XCircle size={18} /> : <CheckCircle2 size={18} />}
        >
          {event.resolved ? 'Unresolve' : 'Resolve'}
        </Button>
      </div>

      <div className="flex items-center justify-between pt-5">
        <div className="flex items-center -ml-5 divide-x">
          {[
            { title: 'Last Seen', data: format(fromUnixTime(event.updatedAt), 'MMM d, h:mm a') },
            { title: 'First Seen', data: format(fromUnixTime(event.createdAt), 'MMM d, h:mm a') },
            { title: 'Count', data: event.count },
          ].map((item) => (
            <div key={item.title} className="px-5">
              <div className="text-xs text-gray-500 uppercase">{item.title}</div>
              <div className="text-sm">{item.data}</div>
            </div>
          ))}
          <div className="px-5">
            <div className="text-xs text-gray-500 uppercase">Severity</div>
            <div
              className={cn(
                'rounded-full py-0.5 px-2 inline-flex text-xs font-medium ring-1 ring-inset',
                event.handled ? 'text-gray-600 bg-gray-50 ring-gray-500/10' : 'text-red-700 bg-red-50 ring-red-600/10'
              )}
            >
              {event.handled ? 'Handled' : 'Unhandled'}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-x-6">
          <div className="flex items-center gap-x-2">
            {options.browser ? (
              <Image className="w-8 h-8 rounded-full" src={options.browser} alt="Browser" />
            ) : (
              <Unknown />
            )}
            <div>
              <div className="font-medium leading-none">{event.browser}</div>
              <div className="text-sm text-gray-500">Version: {event.browserVersion}</div>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            {options.os ? <Image className="w-8 h-8 rounded-full" src={options.os} alt="OS" /> : <Unknown />}
            <div>
              <div className="font-medium leading-none">{event.os}</div>
              <div className="text-sm text-gray-500">Version: {event.osVersion}</div>
            </div>
          </div>
          <div className="flex items-center gap-x-2">
            {options.device ? (
              <div className="flex items-center justify-center w-10 h-10 text-gray-500 bg-gray-200 rounded-full">
                {options.device}
              </div>
            ) : (
              <Unknown />
            )}
            <div className="font-medium leading-none capitalize">{event.device}</div>
          </div>
        </div>
      </div>
    </>
  );
}
