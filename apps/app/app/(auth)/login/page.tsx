import { Box } from '@logbun/ui';
import Link from 'next/link';
import LogInForm from './form';

export const metadata = {
  title: 'Welcome to Logbun',
};

export default async function LogInPage() {
  return (
    <Box>
      <Box.Header>Welcome to Logbun</Box.Header>
      <Box.Content>
        <LogInForm />
        <Box.Description className="pt-4 text-sm">
          Don&apos;t have an account?{' '}
          <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/register">
            Sign Up
          </Link>
        </Box.Description>
      </Box.Content>
    </Box>
  );
}
