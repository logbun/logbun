import { redirect } from 'next/navigation';

interface Props {
  params: { id: string };
}

export default async function Settings({ params: { id } }: Props) {
  redirect(`/${id}/settings/general`);
}
