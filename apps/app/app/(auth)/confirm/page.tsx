import { Box } from '@logbun/ui';

export const metadata = {
  title: 'Verify Email',
};

interface Props {
  searchParams: { email?: string };
}

export default async function ConfirmPage({ searchParams }: Props) {
  return (
    <Box>
      <Box.Header>Please verify your email</Box.Header>
      <Box.Content>
        <span className="text-center text-gray-500">
          Your'e almost there! We sent an email to
          <span className="block pb-6 font-semibold text-gray-900">{searchParams.email || 'your email'}</span>
          <span className="block">Just click on the email to complete your sign up.</span>
          <span className="block">
            If you don't see it, you might need to <span className="font-semibold text-gray-900">check your spam</span>{' '}
            folder.
          </span>
        </span>
      </Box.Content>
    </Box>
  );
}
