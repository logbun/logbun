import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Panel = ({ children }: PanelProps) => {
  return <Card>{children}</Card>;
};

export const PanelHeader = ({ children }: PanelProps) => {
  return (
    <CardHeader className="pt-8">
      <CardTitle className="text-center">{children}</CardTitle>
    </CardHeader>
  );
};

export const PanelContent = ({ children }: PanelProps) => {
  return (
    <CardContent>
      <div className="flex flex-col flex-grow">{children}</div>
    </CardContent>
  );
};

export const PanelDescription = ({ children }: PanelProps) => {
  return <CardDescription className="text-center">{children}</CardDescription>;
};
