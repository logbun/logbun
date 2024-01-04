'use client';

import FilesIcon from '@logbun/app/assets/illustrations/files.svg';
import { platforms } from '@logbun/app/utils';
import { find } from '@logbun/utils';
import Image from 'next/image';
import Link from 'next/link';

interface Props {
  projects: any[];
}

export default function List({ projects }: Props) {
  return (
    <>
      {!projects.length && (
        <div className="flex flex-col items-center justify-center">
          <Image src={FilesIcon} alt="files" className="w-32 h-32" />
          <h6 className="pt-4 pb-1">No projects</h6>
          <p className="text-center text-gray-500">Create a project to start tracking bugs!</p>
        </div>
      )}
      {projects.length && (
        <>
          {projects.map((project) => {
            const platform = find(platforms, ['key', project.platform]);

            return (
              <Link
                className="flex items-center p-3.5 transition-shadow bg-white rounded-xl ring-1 ring-gray-500 ring-opacity-5 gap-x-3 hover:shadow-md hover:shadow-gray-200/50"
                key={project.id}
                href={`/${project.id}`}
              >
                <Image
                  src={platform ? platform.icon : ''}
                  alt={project.name}
                  className="flex-shrink-0 w-6 h-6 bg-gray-200 rounded-md"
                />
                <div>
                  <h6 className="text-base font-medium leading-none">{project.name}</h6>
                  <p className="text-sm leading-tight text-gray-500">{platform ? platform.name : ''}</p>
                </div>
              </Link>
            );
          })}
        </>
      )}
    </>
  );
}
