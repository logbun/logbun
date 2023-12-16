import { getSession } from '@logbun/app/utils/auth';
import { redirect } from 'next/navigation';
import LogInForm from './form';

export default async function LogInPage() {
  const session = await getSession();

  if (session) redirect('/');

  return (
    <>
      <LogInForm />
    </>
  );
}
