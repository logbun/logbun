import { getSession } from '@logbun/app/utils/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@logbun/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import RegisterForm from './form';

export const metadata = {
  title: 'Create an account',
};

export default async function RegisterPage() {
  const session = await getSession();

  if (session) redirect('/');

  return (
    <Card>
      <CardHeader className="pt-8">
        <CardTitle className="text-center">{metadata.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-grow">
          <RegisterForm />
          <CardDescription className="text-center">
            <span className="block pt-4 text-sm">
              Already have an account?{' '}
              <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/login">
                Log In
              </Link>
            </span>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
