import { findProject } from '@logbun/app/actions/db';
import { notFound } from 'next/navigation';
import Side from './side';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export default async function Settings({ params: { id }, children }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  return (
    <div className="pt-12 container-lg">
      <h3>Settings for {project.name}</h3>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 lg:py-8">
        <div className="lg:col-span-3">
          <Side />
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
