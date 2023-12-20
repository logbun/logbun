import { getSession } from '@logbun/app/utils/auth';
import { Panel, PanelContent, PanelDescription, PanelHeader } from '@logbun/ui';
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
    <Panel>
      <PanelHeader>{metadata.title}</PanelHeader>
      <PanelContent>
        <LogInForm />
        <PanelDescription>
          <span className="block pt-4 text-sm">
            Don&apos;t have an account?{' '}
            <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/register">
              Sign Up
            </Link>
          </span>
        </PanelDescription>
      </PanelContent>
    </Panel>
  );
}
