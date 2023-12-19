import { cn } from '@logbun/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, LabelHTMLAttributes } from 'react';

export const labelVariants = cva('block text-sm text-slate-500 leading-6');

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement>, VariantProps<typeof labelVariants> {}

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => {
  const { className, ...rest } = props;
  return <label ref={ref} className={cn(labelVariants(), className)} {...rest} />;
});

Label.displayName = 'Label';
