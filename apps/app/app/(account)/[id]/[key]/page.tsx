import { findProject, getEventDetails } from '@logbun/app/actions';
import { notFound } from 'next/navigation';
import Details from './details';
import Header from './header';

export const metadata = {
  title: 'Issues details',
};

interface Props {
  params: { id: string; key: string };
}

export default async function Page({ params: { id, key } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const event = await getEventDetails(key);

  if (!event) notFound();

  return (
    <div className="container-lg">
      <Header event={event} />
      <div className="py-12">
        <Details event={event} />
      </div>
    </div>
  );
}
