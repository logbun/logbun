'use client';

import { Disclosure } from '@headlessui/react';
import { Minus, Plus } from 'lucide-react';
import React from 'react';

interface Props {
  title: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function Collapsible({ title, children, defaultOpen }: Props) {
  return (
    <Disclosure as="div" defaultOpen={defaultOpen} className="pt-3">
      {({ open }) => (
        <>
          <dt>
            <Disclosure.Button className="flex items-start justify-between w-full text-left">
              <span className="no-wrap">{title}</span>
              <span className="flex items-center ml-6 h-7">
                {open ? <Minus size={18} aria-hidden="true" /> : <Plus size={18} aria-hidden="true" />}
              </span>
            </Disclosure.Button>
          </dt>
          <Disclosure.Panel as="dd" className="pr-12 bg-gray-100 rounded">
            {children}
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
