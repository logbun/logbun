import { findProject, getEvents } from '@logbun/app/actions';
import { Button } from '@logbun/ui';
import { cn } from '@logbun/utils';
import { CheckCircle2, Settings, XCircle } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Issues from './issues';

export const metadata = {
  title: 'Issues',
};

interface Props {
  params: { id: string };
  searchParams: { resolved: string };
}

const tabs = [
  { icon: CheckCircle2, title: 'Resolved', href: '?resolved=true', value: 'true' },
  { icon: XCircle, title: 'Unresolved', href: '?resolved=false', value: 'false' },
  { icon: null, title: 'All', href: '', value: undefined },
];

export default async function Page({ params: { id }, searchParams: { resolved } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const { data, success, message } = await getEvents(project.id, { resolved });

  return (
    <div className="pt-12 container-lg">
      <div className="flex items-center justify-between">
        <h3 className="leading-none">{project.name}</h3>
        <div className="flex items-center space-x-4 text-sm font-medium text-gray-500">
          <div className="flex items-center p-1 bg-gray-200 rounded-md gap-x-1">
            {tabs.map((tab) => (
              <Link
                className={cn('px-2 py-1  hover:text-gray-900 flex items-center gap-x-1', {
                  ['bg-white rounded shadow']: resolved === tab.value,
                })}
                href={`/${id}${tab.href}`}
                key={tab.title}
              >
                {tab.icon && (
                  <tab.icon
                    size={16}
                    className={cn({
                      ['text-green-500']: tab.value === 'true',
                      ['text-red-500']: tab.value === 'false',
                      ['text-gray-500']: tab.value === undefined,
                    })}
                  />
                )}
                <span>{tab.title}</span>
              </Link>
            ))}
          </div>
          <Button asChild variant="secondary" size="small">
            <Link href={`/${project.id}/settings/general`}>
              <Settings size={18} />
              <span>Settings</span>
            </Link>
          </Button>
        </div>
      </div>
      <div className="py-16">
        {success && data && <Issues project={project} issues={data} />}
        {!success && <p className="text-sm text-center text-gray-500">{message}</p>}
      </div>
    </div>
  );
}
