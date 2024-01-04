import List from './list';

export const metadata = {
  title: 'Issues',
};

export default function Page() {
  return (
    <div className="pt-12 container-sm">
      <h3>Issues</h3>
      <div className="w-full py-8">
        <List />
      </div>
    </div>
  );
}
