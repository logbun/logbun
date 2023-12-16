import * as React from 'react';

export function Card({ title, children }: { title: string; children: React.ReactNode }): JSX.Element {
  return (
    <div
      className="px-5 py-4 transition-colors border border-transparent rounded-lg shadow group hover:border-neutral-700 hover:bg-neutral-800/30"
      rel="noopener noreferrer"
    >
      <h2 className="mb-3 text-2xl font-semibold">
        {title}{' '}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
      <p className="m-0 max-w-[30ch] text-sm">{children}</p>
    </div>
  );
}
