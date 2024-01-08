import { denyAccess, getCurrentUser } from '@logbun/app/utils/auth';
import { Panel, PanelContent, PanelHeader } from '@logbun/ui';
import ProjectForm from './form';

export const metadata = {
  title: 'Create your project',
};

export default async function ProjectPage() {
  const user = await getCurrentUser();

  if (!user) denyAccess();

  return (
    <div className="pt-12 container-lg">
      <div className="w-full max-w-lg px-4 py-8 mx-auto">
        <Panel>
          <PanelHeader className="-mt-2 text-2xl">Create your project</PanelHeader>
          <PanelContent>
            <ProjectForm />
          </PanelContent>
        </Panel>
      </div>
    </div>
  );
}
