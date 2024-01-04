import { findProjects } from '@logbun/app/actions/db';
import { denyAccess, getCurrentUser } from '@logbun/app/utils/auth';
import { buttonVariants } from '@logbun/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import List from './list';

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
        <List projects={projects} />
      </div>
    </div>
  );
}
