import { findFirstProject } from '@logbun/app/actions/db';
import { getSession } from '@logbun/app/utils/auth';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (session && session.user) {
    const project = await findFirstProject(session.user.id);

    if (project) redirect(`/${project.id}`);

    redirect('/new');
  }

  return <>{children}</>;
}
