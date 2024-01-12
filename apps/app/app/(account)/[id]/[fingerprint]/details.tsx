'use client';

import { Disclosure } from '@headlessui/react';
import { EventResultResponse } from '@logbun/app/types';
import { Minus, Plus } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism as lightTheme } from 'react-syntax-highlighter/dist/esm/styles/prism';

const normalize = (linesStr?: string | null): string[] => {
  const arr = (linesStr ?? '')?.split('\n');
  const last = arr.pop();
  if (last !== undefined && last !== '') {
    arr.push(last);
  }
  return arr;
};

interface Props {
  event: EventResultResponse;
}

interface StackFrameOptions {
  isConstructor?: boolean;
  isEval?: boolean;
  isNative?: boolean;
  isToplevel?: boolean;
  columnNumber?: number;
  lineNumber?: number;
  fileName?: string;
  functionName?: string;
  source?: string;
  args?: any[];
  evalOrigin?: StackFrameOptions;
}

export default function Details({ event }: Props) {
  const stacks = JSON.parse(event.stacktrace) as StackFrameOptions[];

  return (
    <>
      <h4>Stacktrace</h4>
      <dl className="space-y-3 divide-y">
        {stacks.map((frame) => {
          const title = `${frame.fileName} in ${frame.functionName} at line ${frame.lineNumber}`;

          return (
            <Disclosure as="div" key={title} className="pt-3">
              {({ open }) => (
                <>
                  <dt>
                    <Disclosure.Button className="flex items-start justify-between w-full text-left text-gray-500">
                      <span className="no-wrap">{title}</span>
                      <span className="flex items-center ml-4 h-7">
                        {open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
                      </span>
                    </Disclosure.Button>
                  </dt>
                  <Disclosure.Panel as="dd" className="pr-12">
                    {/* <p className="text-base leading-7 text-gray-600">{faq.answer}</p> */}
                  </Disclosure.Panel>
                </>
              )}
            </Disclosure>
          );
        })}
      </dl>
    </>
  );

  return (
    <>
      <h4>Stacktrace</h4>
      <ul>
        {stacks.map((frame) => {
          console.log(frame);

          const title = `${frame.fileName} in ${frame.functionName} at line ${frame.lineNumber}`;
          return (
            <li>
              <div>{title}</div>
            </li>
          );
        })}
      </ul>
    </>
  );

  return (
    <SyntaxHighlighter wrapLines showLineNumbers style={lightTheme} language="javascript">
      {normalize(event.stack).join('\n')}
    </SyntaxHighlighter>
  );
}