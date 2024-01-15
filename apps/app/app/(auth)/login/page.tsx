import { getCurrentUser } from '@logbun/app/utils/auth';
import { Box } from '@logbun/ui';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import LogInForm from './form';

export const metadata = {
  title: 'Welcome to Logbun',
};

export default async function LogInPage() {
  const user = await getCurrentUser();

  if (user) redirect('/');

  return (
    <Box>
      <Box.Header>Welcome to Logbun</Box.Header>
      <Box.Content>
        <LogInForm />
        <Box.Description>
          <span className="block pt-4 text-sm">
            Don&apos;t have an account?{' '}
            <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/register">
              Sign Up
            </Link>
          </span>
        </Box.Description>
      </Box.Content>
    </Box>
  );
}
