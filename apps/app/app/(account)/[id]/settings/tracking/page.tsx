import { findProject } from '@logbun/app/actions/db';
import { notFound } from 'next/navigation';
import Code from './code';
import { libraries } from './libraries';

interface Props {
  params: { id: string };
}

export default async function Tracking({ params: { id } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const library = libraries[project.platform as keyof typeof libraries] || libraries.js;

  return (
    <div className="py-8">
      <h5>Configure {library.title}</h5>
      <p className="pb-5 text-gray-500">Use these instructions to install Logbun on your app.</p>
      <Code steps={library.steps} />
    </div>
  );
}
