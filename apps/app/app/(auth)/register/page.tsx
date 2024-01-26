import { Box } from '@logbun/ui';
import Link from 'next/link';
import RegisterForm from './form';

export const metadata = {
  title: 'Create an account',
};

export default async function RegisterPage() {
  return (
    <Box>
      <Box.Header>Create an account</Box.Header>
      <Box.Content>
        <RegisterForm />
        <Box.Description className="pt-4 text-sm">
          Already have an account?{' '}
          <Link className="leading-6 text-blue-500 hover:text-blue-600" href="/login">
            Log In
          </Link>
        </Box.Description>
      </Box.Content>
    </Box>
  );
}
