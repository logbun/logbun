import { findProject, getEvents } from '@logbun/app/actions';
import { buttonVariants } from '@logbun/ui';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Issues from './issues';

export const relative = true;

export const metadata = {
  title: 'Issues',
};

interface Props {
  params: { id: string };
}

export default async function Page({ params: { id } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const issues = await getEvents(project.id);

  return (
    <div className="pt-12 container-lg">
      <div className="flex items-center justify-between">
        <h3 className="leading-none">{project.name}</h3>
        <Link
          href={`/${project.id}/settings/general`}
          className={buttonVariants({ variant: 'secondary', size: 'small' })}
        >
          <Settings size={18} />
          <span>Settings</span>
        </Link>
      </div>
      <div className="py-16">
        <Issues project={project} issues={issues} />
      </div>
    </div>
  );
}
