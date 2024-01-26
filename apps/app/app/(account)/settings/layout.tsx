import SideBar from '@logbun/app/components/side-bar';

interface Props {
  children: React.ReactNode;
}

export default async function Settings({ children }: Props) {
  const list = [{ name: 'Profile', href: '/settings/profile' }];

  return (
    <div className="pt-12 container-lg">
      <h3>Settings</h3>
      <div className="lg:grid lg:grid-cols-12 lg:gap-x-5 lg:py-8">
        <div className="lg:col-span-3">
          <SideBar list={list} />
        </div>
        <div className="lg:col-span-9">{children}</div>
      </div>
    </div>
  );
}
