import { getSession } from '@logbun/app/utils/auth';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (session) redirect('/projects');

  return <>{children}</>;
}
