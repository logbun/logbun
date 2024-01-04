import Header from './header';

interface Props {
  children: React.ReactNode;
}

export default function Settings({ children }: Props) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}
