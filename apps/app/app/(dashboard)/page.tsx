import { denyAccess, getSession } from '@logbun/app/utils/auth';
import DashboardForm from './form';

export default async function Page() {
  const session = await getSession();

  if (!session) denyAccess();

  return <DashboardForm />;
}
