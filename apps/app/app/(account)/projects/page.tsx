import { findProjects } from '@logbun/app/actions';
import { denyAccess, getCurrentUser } from '@logbun/app/utils/auth';
import { Button } from '@logbun/ui';
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
    <div className="pt-12 container-lg">
      <div className="flex items-center justify-between">
        <h3>Projects</h3>
        <Button asChild>
          <Link href="/new">
            <Plus size={20} />
            Create
          </Link>
        </Button>
      </div>
      <div className="py-8">
        <List projects={projects} />
      </div>
    </div>
  );
}
