import { getCurrentUser } from '@logbun/app/utils/auth';
import { db, eq } from '@logbun/db';
import { projects } from '@logbun/db/schema';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getCurrentUser();

  if (user) {
    const project = await db.query.projects.findFirst({ where: eq(projects.userId, user.id) });

    // if (project) redirect(`/${project.id}`);

    redirect('/projects');
  }

  return <>{children}</>;
}
