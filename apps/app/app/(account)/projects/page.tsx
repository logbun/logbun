import { findProjects } from '@logbun/app/actions/db';
import React from '@logbun/app/assets/platforms/react.svg';
import { denyAccess, getCurrentUser } from '@logbun/app/utils/auth';
import { buttonVariants } from '@logbun/ui';
import { Plus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

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
            {projects.map((project) => (
              <Link
                className="flex items-center p-4 transition-shadow bg-white rounded-lg gap-x-3 hover:shadow-md hover:shadow-gray-200"
                key={project.id}
                href={`/${project.id}`}
              >
                <Image src={React} alt={project.name} className="flex-shrink-0 rounded-md w-7 h-7" />
                <h6 className="text-base font-medium">{project.name}</h6>
              </Link>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
