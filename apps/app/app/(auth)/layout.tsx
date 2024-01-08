import { getCurrentUser } from '@logbun/app/utils/auth';
import { Icon } from '@logbun/ui';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const user = await getCurrentUser();

  if (user) redirect('/');

  return (
    <div className="flex flex-col justify-center w-full h-full bg-gray-100">
      <div className="w-full max-w-md px-4 mx-auto space-y-4">
        <Icon className="w-auto h-10 mx-auto" />
        {children}
      </div>
    </div>
  );
}
