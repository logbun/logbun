import { getSession } from '@logbun/app/utils/auth';
import { Icon } from '@logbun/ui';
import { redirect } from 'next/navigation';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (session) redirect('/');

  return (
    <div className="flex flex-col justify-center w-full h-full bg-gray-200">
      <div className="w-full max-w-sm px-4 mx-auto space-y-4">
        <Icon className="w-auto h-10 mx-auto" />
        {children}
      </div>
    </div>
  );
}
