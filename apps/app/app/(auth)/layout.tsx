import { Icon } from '@logbun/ui/logo';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col justify-center w-full h-full bg-slate-200">
      <div className="w-full max-w-sm px-4 mx-auto space-y-4">
        <Icon height={40} className="w-auto mx-auto" />
        {children}
      </div>
    </div>
  );
}
