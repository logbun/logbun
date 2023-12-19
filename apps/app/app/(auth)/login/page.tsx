import { getSession } from '@logbun/app/utils/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@logbun/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogInForm from './form';

export const metadata = {
  title: 'Welcome to Logbun',
};

export default async function LogInPage() {
  const session = await getSession();

  if (session) redirect('/');

  return (
    <Card>
      <CardHeader className="pt-8">
        <CardTitle className="text-center">{metadata.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col flex-grow">
          <LogInForm />
          <CardDescription className="text-center">
            <span className="block pt-4 text-sm">
              Don&apos;t have an account?{' '}
              <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/register">
                Sign Up
              </Link>
            </span>
          </CardDescription>
        </div>
      </CardContent>
    </Card>
  );
}
