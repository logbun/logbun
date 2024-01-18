import { findProject } from '@logbun/app/actions';
import { notFound } from 'next/navigation';
import GeneralForm from './form';

interface Props {
  params: { id: string };
}

export default async function General({ params: { id } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  return <GeneralForm project={project} />;
}
