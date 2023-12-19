import { getSession } from '@logbun/app/utils/auth';
import { Card } from '@logbun/ui';
import { redirect } from 'next/navigation';
import RegisterForm from './form';

export default async function RegisterPage() {
  const session = await getSession();

  if (session) redirect('/');

  return (
    <Card title="Register">
      <RegisterForm />
    </Card>
  );
}
