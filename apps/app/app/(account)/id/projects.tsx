'use client';

import { Select } from '@logbun/ui';
import { cn, find } from '@logbun/utils';
import { Check } from 'lucide-react';
import { useParams } from 'next/navigation';

// const platforms = [
//   { key: 'javascript', name: 'Browser Javascript', icon: Next },
//   { key: 'angular', name: 'Angular', icon: Next },
//   { key: 'next', name: 'Next.JS', icon: Next },
//   { key: 'react', name: 'React', icon: Next },
//   { key: 'svelte', name: 'Svelte', icon: Next },
//   { key: 'vue', name: 'Vue', icon: Next },
//   { key: 'node', name: 'Node.JS', icon: Next },
//   { key: 'express', name: 'Express', icon: Next },
// ];

interface Props {
  projects: { id: string; name: string }[];
}

export default function Projects({ projects }: Props) {
  const params = useParams();

  const selected = find(projects, ['id', params.id]);

  return (
    <Select
      button={
        <Select.Button className="px-1.5 py-1.5 shadow shadow-gray-300 ring-0">
          <span className="flex items-center">
            <span className="inline-flex items-center justify-center flex-shrink-0 rounded-md w-7 h-7 bg-gray-200">
              <span className="font-medium leading-none uppercase text-md text-gray-600">
                {selected?.name.charAt(0)}
              </span>
            </span>
            <span className="block ml-2 font-semibold truncate">{selected?.name}</span>
          </span>
        </Select.Button>
      }
      value={1}
      onChange={() => null}
    >
      <Select.Options>
        {projects.map((option) => (
          <Select.Option value={option.id} id={option.id}>
            {({ selected }: { selected: boolean }) => (
              <>
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center flex-shrink-0 w-6 h-6 rounded-md bg-gray-600">
                    <span className="text-xs font-medium leading-none text-white uppercase">
                      {option.name.charAt(0)}
                    </span>
                  </span>
                  <span className={cn(selected ? 'font-semibold' : 'font-medium', 'ml-3 block truncate')}>
                    {option.name}
                  </span>
                </div>
                {selected ? (
                  <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-800">
                    <Check className="w-4 h-4" />
                  </span>
                ) : null}
              </>
            )}
          </Select.Option>
        ))}
      </Select.Options>
    </Select>
  );
}
