import { findProject } from '@logbun/app/actions';
import { platforms } from '@logbun/app/utils';
import { Card, CardDescription, CardHeader, CardTitle } from '@logbun/ui';
import { find } from '@logbun/utils';
import { notFound } from 'next/navigation';
import Code from './code';
import { generateLibraries } from './libraries';

interface Props {
  params: { id: string };
}

export default async function Tracking({ params: { id } }: Props) {
  const project = await findProject(id);

  if (!project) notFound();

  const libraries = generateLibraries({
    apiKey: project.apiKey,
    cdnUrl: process.env.NEXT_PUBLIC_CDN_URL,
  });

  const key = project.platform as keyof typeof libraries;

  const steps = libraries[key] || libraries.js;

  const platform = find(platforms, ['key', project.platform]);

  return (
    <Card className="shadow">
      <CardHeader className="pb-0">
        <CardTitle>Configure {platform?.name} SDK</CardTitle>
        <CardDescription>Use these instructions to install Logbun on your {platform?.name} app.</CardDescription>
      </CardHeader>
      <Code steps={steps} />
    </Card>
  );
}
