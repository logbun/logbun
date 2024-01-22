import { cn } from '@logbun/utils';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cloneElement, forwardRef, ReactElement } from 'react';
import { Spinner } from './spinner';

export const buttonVariants = cva(
  [
    'relative',
    'rounded-md',
    'inline-flex',
    'items-center',
    'justify-center',
    'font-medium',
    'text-sm',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'whitespace-nowrap',
    'transition-all',
  ],
  {
    variants: {
      variant: {
        primary: [
          'relative',
          'bg-gray-800',
          'text-white',
          'hover:bg-gray-700',
          'focus-visible:outline',
          'focus-visible:outline-2',
          'focus-visible:outline-offset-2',
          'focus-visible:outline-gray-500',
          'disabled:hover:bg-gray-500',
          'shadow-sm',
        ],
        secondary: [
          'bg-white',
          'text-gray-900',
          'hover:bg-gray-50',
          'shadow-sm',
          'ring-1',
          'ring-inset',
          'ring-gray-300',
        ],
        danger: ['bg-red-100', 'text-red-500', 'hover:bg-red-200'],
        default: ['text-gray-900', 'hover:bg-gray-100'],
      },
      size: {
        small: ['py-1.5', 'px-2.5', 'gap-x-1'],
        medium: ['py-2', 'px-3', 'gap-x-1.5'],
        large: ['py-2.5', 'px-3.5', 'gap-x-2'],
        xlarge: ['py-3', 'px-4', 'gap-x-2'],
      },
      loading: {
        true: 'cursor-wait',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  icon?: ReactElement;
  asChild?: boolean;
  iconPosition?: 'start' | 'end';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, asChild = false, loading, iconPosition = 'start', icon, children, ...rest } = props;

  const Component = asChild ? Slot : 'button';

  const renderStart = () => {
    if (loading) {
      return (
        <div>
          <Spinner variant={variant} />
        </div>
      );
    }

    if (iconPosition === 'start' && icon) {
      return cloneElement(icon, { className: icon.props.className });
    }

    return null;
  };

  return (
    <Component ref={ref} disabled={!!loading} type="button" {...rest}>
      <div className={cn(buttonVariants({ variant, size, loading, className }))}>
        {renderStart()}
        {children}
        {iconPosition === 'end' && icon && cloneElement(icon, { className: icon.props.className })}
      </div>
    </Component>
  );
});

Button.displayName = 'Button';
