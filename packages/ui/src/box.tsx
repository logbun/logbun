import { cn } from '@logbun/utils/client';
import { Card } from './card';

interface BoxProps extends React.HTMLAttributes<HTMLDivElement> {}

const BoxRoot = ({ children, ...rest }: BoxProps) => {
  return <Card {...rest}>{children}</Card>;
};

const BoxHeader = ({ children, className, ...rest }: BoxProps) => {
  return (
    <Card.Header>
      <Card.Title {...rest} className={cn('text-center', className)}>
        {children}
      </Card.Title>
    </Card.Header>
  );
};

const BoxContent = ({ children, ...rest }: BoxProps) => {
  return (
    <Card.Content {...rest}>
      <div className="flex flex-col flex-grow">{children}</div>
    </Card.Content>
  );
};

const BoxDescription = ({ children, className, ...rest }: BoxProps) => {
  return (
    <Card.Description {...rest} className={cn('text-center', className)}>
      {children}
    </Card.Description>
  );
};

export const Box = Object.assign(BoxRoot, {
  Header: BoxHeader,
  Content: BoxContent,
  Description: BoxDescription,
});
