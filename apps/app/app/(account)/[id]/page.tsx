import { findProject, getEvents } from '@logbun/app/actions/db';
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
      <h3>{project.name}</h3>
      <div className="py-8">
        <Events project={project} events={events} />
      </div>
    </div>
  );
}
