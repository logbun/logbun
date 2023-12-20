import { getSession } from '@logbun/app/utils/auth';
import { Panel, PanelContent, PanelDescription, PanelHeader } from '@logbun/ui';
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
    <Panel>
      <PanelHeader>{metadata.title}</PanelHeader>
      <PanelContent>
        <RegisterForm />
        <PanelDescription>
          <span className="block pt-4 text-sm">
            Already have an account?{' '}
            <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/login">
              Log In
            </Link>
          </span>
        </PanelDescription>
      </PanelContent>
    </Panel>
  );
}
