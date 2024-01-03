import { findProjects } from '@logbun/app/actions/db';
import { platforms } from '@logbun/app/utils';
import { denyAccess, getCurrentUser } from '@logbun/app/utils/auth';
import { buttonVariants } from '@logbun/ui';
import { find } from '@logbun/utils';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const user = await getCurrentUser();

  if (!user) return denyAccess();

  const projects = await findProjects(user.id);

  return (
    <div className="pt-12 container-sm">
      <div className="flex items-center justify-between">
        <h3>Projects</h3>
        <Link href="/new" className={buttonVariants({ variant: 'secondary', size: 'small' })}>
          <Plus size={18} />
          Create
        </Link>
      </div>
      <div className="py-8 space-y-4">
        {!projects.length && <p className="text-center text-gray-400">No projects</p>}
        {projects.length && (
          <>
            {projects.map((project) => {
              const platform = find(platforms, ['key', project.platform]);

              return (
                <Link
                  className="flex items-center p-4 transition-shadow bg-white rounded-xl ring-1 ring-gray-500 ring-opacity-5 gap-x-3 hover:shadow-md hover:shadow-gray-200/50"
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
      </div>
    </div>
  );
}
