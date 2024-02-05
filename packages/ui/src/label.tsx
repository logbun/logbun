import { cn } from '@logbun/utils/client';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef } from 'react';

export const labelVariants = cva('block text-sm font-medium text-gray-500 leading-6');

type LabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & VariantProps<typeof labelVariants>;

export const Label = forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, LabelProps>((props, ref) => {
  const { className, ...rest } = props;
  return <LabelPrimitive.Root ref={ref} className={cn(labelVariants(), className)} {...rest} />;
});

Label.displayName = 'Label';
