'use client';

import FilesIcon from '@logbun/app/assets/illustrations/files.svg';
import { Project } from '@logbun/app/types';
import { platforms } from '@logbun/app/utils';
import { find } from '@logbun/utils';
import { ChevronRightIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  projects: Project[];
}

export default function List({ projects }: Props) {
  return (
    <>
      {projects.length === 0 && (
        <div className="flex flex-col items-center justify-center">
          <Image src={FilesIcon} alt="files" className="w-32 h-32" />
          <h4 className="pt-4 pb-1">No projects</h4>
          <p className="text-center text-gray-500">Create a project to start tracking bugs!</p>
        </div>
      )}
      {projects.length > 0 && (
        <ul role="list" className="space-y-4">
          {projects.map((project) => {
            const platform = find(platforms, ['key', project.platform]);

            return (
              <Link
                className="relative transition-all hover:bg-opacity-10 flex items-center justify-between flex-1 p-3.5 bg-white rounded-lg shadow-md shadow-gray-100 ring-1 ring-gray-200/50"
                key={project.id}
                href={`/${project.id}`}
              >
                <div className="flex items-center justify-center gap-x-4">
                  <Image
                    src={platform ? platform.icon : ''}
                    alt={project.name}
                    className="flex-shrink-0 w-10 h-10 bg-gray-200 rounded-md"
                  />
                  <div className="truncate">
                    <h6 className="font-medium leading-none">{project.name}</h6>
                    <p className="text-sm text-gray-500">{platform ? platform.name : ''}</p>
                  </div>
                </div>
                <ChevronRightIcon className="flex-none w-5 h-5 text-gray-400" aria-hidden="true" />
              </Link>
            );
          })}
        </ul>
      )}
    </>
  );
}
