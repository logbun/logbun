import { getSession } from '@logbun/app/utils/auth';
import { db, eq } from '@logbun/db';
import { projects } from '@logbun/db/schema';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (session && session.user) {
    const project = await db.query.projects.findFirst({ where: eq(projects.userId, session.user.id) });

    if (project) redirect(`/${project.id}`);

    redirect('/new');
  }

  return <>{children}</>;
}
