import { denyAccess, getSession } from '@logbun/app/utils/auth';
// import Nav from './nav';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (!session || !session.user) return denyAccess();

  // const projects = await findProjects(session.user.id);

  return (
    <div className="flex h-full">
      <div className="w-full h-full">
        <div className="h-16" />
        {/* <Nav /> */}
        {children}
      </div>

      {/* <div className="w-full h-full max-w-6xl px-4 mx-auto sm:px-6 lg:px-8">
        <Nav />
        {children}
      </div> */}
    </div>
  );
}
