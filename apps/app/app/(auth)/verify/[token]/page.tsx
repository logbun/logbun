import { verifyToken } from '@logbun/app/actions';
import { Box } from '@logbun/ui';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Verify Email',
};

interface Props {
  params: { token: string };
  searchParams: { email?: string };
}

export default async function VerifyPage({ params: { token }, searchParams: { email } }: Props) {
  if (!token || !email) {
    return (
      <Box>
        <Box.Header>Unable to verify email</Box.Header>
        <Box.Content>
          <span className="text-center">No token or email provided. Please check your email and try again.</span>
        </Box.Content>
      </Box>
    );
  }

  const { success, message } = await verifyToken(email, token);

  if (!success) {
    return (
      <Box>
        <Box.Header>Unable to verify email</Box.Header>
        <Box.Content>
          <span className="text-center">{message}</span>
        </Box.Content>
      </Box>
    );
  }

  redirect(`/login/?verified=true`);
}
