import { cn } from '@logbun/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { cloneElement, forwardRef, InputHTMLAttributes, ReactElement } from 'react';

export const inputVariants = cva(
  [
    'block',
    'border',
    'border-transparent',
    'py-1.5',
    'rounded-lg',
    'w-full',
    'ring-1',
    'placeholder:text-slate-400/80',
    'focus:ring-2',
    'disabled:cursor-not-allowed',
    'disabled:bg-slate-50',
    'disabled:text-slate-500',
    'disabled:ring-slate-200',
    'sm:text-sm',
    'sm:leading-6',
  ],
  {
    variants: {
      variant: {
        default: ['focus:border-blue-500', 'ring-slate-300', 'focus:ring-blue-200', 'text-slate-900'],
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

// type VariantPropsValues = Omit<VariantProps<typeof inputVariants>, 'start' | 'end'> & {
//   start?: React.ReactNode;
//   end?: React.ReactNode;
// };

export interface InputProps extends InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {
  icon?: ReactElement;
  iconPosition?: 'start' | 'end';
}

export const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { className, variant, iconPosition = 'start', icon, ...rest } = props;

  return (
    <div className="relative rounded-lg">
      {iconPosition === 'start' && icon && (
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          {cloneElement(icon, { className: 'text-slate-400', size: 18 })}
        </div>
      )}
      <input
        ref={ref}
        className={cn(inputVariants({ variant, iconPosition: icon ? iconPosition : undefined, className }))}
        {...rest}
      />
      {iconPosition === 'end' && icon && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          {cloneElement(icon, { className: 'text-slate-400', size: 18 })}
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';
