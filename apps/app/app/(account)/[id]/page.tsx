import { findProject, getEvents } from '@logbun/app/actions/db';
import { Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Events from './events';

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

  const events = await getEvents(project.apiKey);

  return (
    <div className="pt-12 container-lg">
      <div className="flex items-center gap-x-2">
        <h3 className="leading-none">{project.name}</h3>
        <Link href={`/${project.id}/settings`} className="-mb-1 text-gray-400 transition-colors hover:text-gray-500">
          <Settings size={20} />
        </Link>
      </div>
      <div className="py-8">
        <Events project={project} events={events} />
      </div>
    </div>
  );
}
