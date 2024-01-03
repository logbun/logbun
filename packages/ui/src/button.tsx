import { cn } from '@logbun/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { cloneElement, forwardRef, ReactElement } from 'react';
import { Spinner } from './spinner';

export const buttonVariants = cva(
  [
    'relative',
    'rounded-lg',
    'inline-flex',
    'items-center',
    'justify-center',
    'gap-x-2',
    'shadow-sm',
    'font-medium',
    'text-sm',
    'disabled:cursor-not-allowed',
    'disabled:opacity-50',
    'whitespace-nowrap',
  ],
  {
    variants: {
      variant: {
        primary: [
          'relative',
          'bg-gray-800',
          'text-white',
          'hover:bg-opacity-95',
          'focus-visible:outline',
          'focus-visible:outline-2',
          'focus-visible:outline-offset-2',
          'focus-visible:outline-gray-500',
          'disabled:hover:bg-gray-500',
        ],
        secondary: [
          'bg-white',
          'text-gray-900',
          'ring-1',
          'ring-inset',
          'ring-gray-300',
          'hover:bg-gray-50',
          'shadow-gray-100',
        ],
        default: ['text-gray-900', 'hover:bg-gray-50', 'shadow-none'],
      },
      size: {
        small: ['py-1.5', 'px-2.5'],
        medium: ['py-2', 'px-3'],
        large: ['py-2.5', 'px-3.5'],
        xlarge: ['py-3', 'px-4'],
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
  iconPosition?: 'start' | 'end';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const { className, variant, size, loading, iconPosition = 'start', icon, children, ...rest } = props;

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
    <button
      ref={ref}
      disabled={!!loading}
      className={cn(buttonVariants({ variant, size, loading, className }))}
      type="button"
      {...rest}
    >
      {renderStart()}
      {children}
      {iconPosition === 'end' && icon && cloneElement(icon, { className: icon.props.className })}
    </button>
  );
});

Button.displayName = 'Button';
