'use client';

import { Disclosure } from '@headlessui/react';
import { EventResultResponse } from '@logbun/app/types';
import { getLevelEmoji } from '@logbun/app/utils';
import { Minus, Plus } from 'lucide-react';

interface Props {
  event: EventResultResponse;
}

export default function Details({ event }: Props) {
  return (
    <>
      <h4 className="pb-3">Stacktrace</h4>
      <dl className="px-5 pt-0 pb-3 space-y-3 bg-white divide-y rounded-lg shadow p-b shadow-gray-100 ring-1 ring-gray-200/50">
        {event.stacktrace.map((frame) => {
          const key = '' + frame.fileName + frame.functionName + frame.lineNumber;

          const header: JSX.Element[] = [];

          if (frame.fileName) {
            header.push(
              <span key={key} className="text-sm">
                {getLevelEmoji(event.level).icon}
                {'  '}
              </span>
            );
            header.push(<span key={key}> {frame.fileName}</span>);
          }

          if (frame.functionName) {
            header.push(
              <span key={key} className="text-gray-500">
                {' '}
                in{' '}
              </span>
            );
            header.push(<span key={key}>{frame.functionName}</span>);
          }

          if (frame.lineNumber) {
            header.push(
              <span key={key} className="text-gray-500">
                {' '}
                at line{' '}
              </span>
            );
            header.push(<span key={key}>{frame.lineNumber}</span>);
          }

          if (frame.columnNumber) {
            header.push(
              <span key={key} className="text-gray-500">
                :
              </span>
            );
            header.push(<span key={key}>{frame.columnNumber}</span>);
          }

          return (
            <Disclosure as="div" key={key} className="pt-3">
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex items-start justify-between w-full text-left">
                      <span className="no-wrap">{header}</span>
                      <span className="flex items-center ml-4 h-7">
                        {open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="pr-12">
                    {true && (
                      <p className="pt-2 text-base leading-7 text-gray-600">
                        <span className="text-xl">🤷🏻‍♂️</span> No additional context
                      </p>
                    )}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </dl>
    </>
  );
}
