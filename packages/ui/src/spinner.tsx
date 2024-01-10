import { cn } from '@logbun/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, SVGAttributes } from 'react';

export const svgVariants = cva(['animate-spin', 'w-4', 'h-4'], {
  variants: {
    variant: {
      primary: ['text-white'],
      secondary: ['text-gray-500'],
      danger: ['text-red-500'],
      default: ['text-indigo-500'],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
});

export interface SpinnerProps extends SVGAttributes<SVGSVGElement>, VariantProps<typeof svgVariants> {}

export const Spinner = forwardRef<SVGSVGElement, Omit<SpinnerProps, 'children'>>((props, ref) => {
  const { className, variant, ...rest } = props;
  return (
    <svg
      ref={ref}
      className={cn(svgVariants({ variant, className }))}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      {...rest}
    >
      <circle className="opacity-40" cx={12} cy={12} r={10} stroke="currentColor" strokeWidth={4} />
      <path
        className="opacity-100"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
});

Spinner.displayName = 'Spinner';
