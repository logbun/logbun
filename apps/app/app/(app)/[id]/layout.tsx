import { findProjects } from '@logbun/app/actions/db';
import { denyAccess, getSession } from '@logbun/app/utils/auth';
import { Icon } from '@logbun/ui';
import Link from 'next/link';
import Projects from './projects';
import Sidebar from './sidebar';

interface Props {
  children: React.ReactNode;
}

export default async function Layout({ children }: Props) {
  const session = await getSession();

  if (!session || !session.user) return denyAccess();

  const projects = await findProjects(session.user.id);

  return (
    <div className="w-full h-full bg-slate-200 bg-opacity-70">
      <div className="relative flex w-full h-full max-w-screen-xl mx-auto space-x-10">
        <div className="z-50 flex flex-col w-16 sm:w-56">
          <div className="flex flex-col grow">
            {/* Logo */}
            <div className="flex items-center h-16 shrink-0">
              <Link className="flex" href="/">
                <Icon className="w-auto h-8" />
              </Link>
            </div>

            {/* Projects */}
            <Projects projects={projects} />

            {/* Navigation */}
            <Sidebar />
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}
