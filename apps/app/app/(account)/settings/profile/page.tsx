import { findUser } from '@logbun/app/actions';
import { getCurrentUser } from '@logbun/app/utils/auth';
import { notFound } from 'next/navigation';
import ProfileForm from './form';

export default async function Profile() {
  const user = await getCurrentUser();

  if (!user) notFound();

  const profile = await findUser(user.id);

  if (!profile) notFound();

  return <ProfileForm user={{ id: user.id, email: profile.email, name: profile.name! }} />;
}
