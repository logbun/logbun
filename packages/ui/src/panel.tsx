import { cn } from '@logbun/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface PanelProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Panel = ({ children, ...rest }: PanelProps) => {
  return <Card {...rest}>{children}</Card>;
};

export const PanelHeader = ({ children, className, ...rest }: PanelProps) => {
  return (
    <CardHeader className="pt-8">
      <CardTitle {...rest} className={cn(className, 'text-center')}>
        {children}
      </CardTitle>
    </CardHeader>
  );
};

export const PanelContent = ({ children, ...rest }: PanelProps) => {
  return (
    <CardContent {...rest}>
      <div className="flex flex-col flex-grow">{children}</div>
    </CardContent>
  );
};

export const PanelDescription = ({ children, className, ...rest }: PanelProps) => {
  return (
    <CardDescription {...rest} className={cn(className, 'text-center')}>
      {children}
    </CardDescription>
  );
};
