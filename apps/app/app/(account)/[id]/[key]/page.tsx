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

  const { data, success, message } = await getEventDetails(key);

  if (!data) notFound();

  return (
    <div className="container-lg">
      <Header event={data} />
      <div className="py-12">
        {success && data && <Details event={data} />}
        {!success && <p className="text-sm text-center text-gray-500">{message}</p>}
      </div>
    </div>
  );
}
