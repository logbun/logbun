import { denyAccess, getSession } from '@logbun/app/utils/auth';
import { Panel, PanelContent, PanelHeader } from '@logbun/ui';
import ProjectForm from './form';

export const metadata = {
  title: 'Create your project',
};

export default async function ProjectPage() {
  const session = await getSession();

  if (!session) denyAccess();

  return (
    <Panel>
      <PanelHeader>{metadata.title}</PanelHeader>
      <PanelContent>
        <ProjectForm />
      </PanelContent>
    </Panel>
  );
}
