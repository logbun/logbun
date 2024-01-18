import { cn } from '@logbun/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}

const BoxRoot = ({ children, ...rest }: BoxProps) => {
  return <Card {...rest}>{children}</Card>;
};

const BoxHeader = ({ children, className, ...rest }: BoxProps) => {
  return (
    <CardHeader>
      <CardTitle {...rest} className={cn('text-center', className)}>
        {children}
      </CardTitle>
    </CardHeader>
  );
};

const BoxContent = ({ children, ...rest }: BoxProps) => {
  return (
    <CardContent {...rest}>
      <div className="flex flex-col flex-grow">{children}</div>
    </CardContent>
  );
};

const BoxDescription = ({ children, className, ...rest }: BoxProps) => {
  return (
    <CardDescription {...rest} className={cn('text-center', className)}>
      {children}
    </CardDescription>
  );
};

export const Box = Object.assign(BoxRoot, {
  Header: BoxHeader,
  Content: BoxContent,
  Description: BoxDescription,
});
