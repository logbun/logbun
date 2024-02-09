import { cn } from '@logbun/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { cloneElement, forwardRef, InputHTMLAttributes, ReactElement } from 'react';

export const inputVariants = cva(
  [
    'block',
    'border',
    'border-transparent',
    'py-2',
    'rounded-md',
    'w-full',
    'ring-1',
    'focus:ring-2',
    'disabled:cursor-not-allowed',
    'disabled:bg-gray-50',
    'disabled:text-gray-500',
    'disabled:ring-gray-200',
    'sm:text-sm',
    'ring-inset',
  ],
  {
    variants: {
      variant: {
        default: ['focus:border-blue-500', 'ring-gray-300', 'focus:ring-blue-200', 'text-gray-900'],
      },
      iconPosition: {
        start: 'pl-10',
        end: 'pr-10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface InputBaseProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
}

export const InputBase = forwardRef<HTMLInputElement, InputBaseProps>((props, ref) => {
  const { className, variant, iconPosition = 'start', icon, ...rest } = props;

  return (
    <div className="relative rounded-lg">
      {iconPosition === 'start' && icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {cloneElement(icon, { className: 'text-gray-400', size: 18 })}
        </div>
      )}
      <input
        ref={ref}
        className={cn(inputVariants({ variant, iconPosition: icon ? iconPosition : undefined, className }))}
        {...rest}
      />
      {iconPosition === 'end' && icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {cloneElement(icon, { className: 'text-gray-400', size: 18 })}
        </div>
      )}
    </div>
  );
});

InputBase.displayName = 'InputBase';
