import { findProjects } from '@logbun/app/actions';
import { getCurrentUser } from '@logbun/app/utils/auth';
import { buttonVariants } from '@logbun/ui';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import List from './list';

export const metadata = {
  title: 'Projects',
};

export default async function Projects() {
  const user = await getCurrentUser();

  const projects = await findProjects(user!.id);

  return (
    <div className="pt-12 container-lg">
      <div className="flex items-center justify-between">
        <h3>Projects</h3>
        <Link href="/new" className={buttonVariants()}>
          <Plus size={20} />
          Create
        </Link>
      </div>
      <div className="py-8">
        <List projects={projects} />
      </div>
    </div>
  );
}
