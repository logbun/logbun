import { findProject } from '@logbun/app/actions/db';
import { notFound } from 'next/navigation';
import Header from './header';

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
      <Header />
      {children}
    </div>
  );
}
