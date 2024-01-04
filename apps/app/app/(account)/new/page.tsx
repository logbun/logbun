import { denyAccess, getSession } from '@logbun/app/utils/auth';
import ProjectForm from './form';

export const metadata = {
  title: 'Create your project',
};

export default async function ProjectPage() {
  const session = await getSession();

  if (!session) denyAccess();

  return (
    <div className="pt-12 container-sm">
      <h3>Create your project</h3>
      <div className="w-full py-8">
        <ProjectForm />
      </div>
    </div>
  );
}
