import { forwardRef, HTMLAttributes } from 'react';
import ReactDiv100vh from 'react-div-100vh';

export const Viewport = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  return <ReactDiv100vh ref={ref} {...props} />;
});

Viewport.displayName = 'Viewport';
