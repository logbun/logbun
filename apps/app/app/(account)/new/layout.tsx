interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  return (
    <div className="flex flex-col justify-center w-full h-full bg-slate-200">
      <div className="w-full max-w-sm mx-auto">{children}</div>
    </div>
  );
}
