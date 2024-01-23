'use client';

import { Slot } from '@radix-ui/react-slot';
import { ReactNode, cloneElement, forwardRef, isValidElement } from 'react';

export type SlotChildProps = {
  asChild?: boolean;
  child: ReactNode;
  // eslint-disable-next-line no-unused-vars
  children: ReactNode | ((child: ReactNode) => ReactNode);
};

function getContent({ children }: SlotChildProps, arg: ReactNode) {
  return typeof children === 'function' ? children(arg) : children;
}

export const SlotChild = forwardRef<HTMLDivElement, SlotChildProps>((props, ref) => {
  const { asChild, child, children, ...attrs } = props;

  if (!isValidElement(child)) {
    return asChild ? null : <>{getContent(props, child)}</>;
  }

  const slot = child.type === Slot;

  const childSlot = !!child.props.asChild;

  return cloneElement(
    child,
    { ...child.props, ...attrs, ...{ ref } },
    slot || childSlot ? (
      <SlotChild asChild={asChild} child={child.props.children} children={children} />
    ) : (
      getContent(props, child.props.children)
    )
  );
});
