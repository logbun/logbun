import { getSession } from '@logbun/app/utils/auth';
import { redirect } from 'next/navigation';
import RegisterForm from './form';

export default async function RegisterPage() {
  const session = await getSession();

  if (session) redirect('/');

  return (
    <>
      <RegisterForm />
    </>
  );
}
