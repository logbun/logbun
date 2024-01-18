import { findProject } from '@logbun/app/actions';
import SideBar from '@logbun/app/components/side-bar';
import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface Props {
  params: { id: string };
  children: React.ReactNode;
}

export default async function Settings({ params: { id }, children }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const list = [
    { name: 'General', href: `/${id}/settings/general` },
    { name: 'Tracking', href: `/${id}/settings/tracking` },
  ];

  return (
    <div className="pt-12 container-lg">
      <div className="flex flex-col space-y-2">
        <Link className="inline-flex items-center text-gray-500 hover:text-gray-600" href={`/${id}`}>
          <ChevronLeft size={18} />
          <span>Back</span>
        </Link>
        <h3>Settings for {project.name}</h3>
      </div>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 lg:py-8">
        <div className="lg:col-span-3">
          <SideBar list={list} />
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
