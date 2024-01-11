import { getEventDetails } from '@logbun/app/actions';
import { findProject } from '@logbun/app/actions/db';
import { notFound } from 'next/navigation';
import Details from './details';
import Header from './header';

export const relative = true;

export const metadata = {
  title: 'Issues details',
};

interface Props {
  params: { id: string; fingerprint: string };
}

export default async function Page({ params: { id, fingerprint } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const event = await getEventDetails(fingerprint);

  if (!event) notFound();

  return (
    <div className="container-lg">
      <Header event={event} />
      <div className="py-8">
        <Details event={event} />
      </div>
    </div>
  );
}
