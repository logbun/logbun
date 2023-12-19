import { Icon } from '@logbun/ui/logo';

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col justify-center w-full h-full bg-gray-100">
      <div className="flex flex-col justify-center flex-grow w-full h-full max-w-md p-6 mx-auto">
        <div>
          <Icon height={40} className="w-auto mx-auto" />
          {children}
        </div>
      </div>
    </div>
  );
}
