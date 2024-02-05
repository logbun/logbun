'use client';

import { cn } from '@logbun/utils/client';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { MinusIcon, PlusIcon } from 'lucide-react';
import { forwardRef } from 'react';

type AccordionItemRef = React.ElementRef<typeof AccordionPrimitive.Item>;
type AccordionItemProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item>;

type AccordionTriggerRef = React.ElementRef<typeof AccordionPrimitive.Trigger>;
type AccordionTriggerProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>;

type AccordionContentRef = React.ElementRef<typeof AccordionPrimitive.Content>;
type AccordionContentProps = React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>;

const AccordionRoot = AccordionPrimitive.Root;

const AccordionItem = forwardRef<AccordionItemRef, AccordionItemProps>(({ className, ...props }, ref) => (
  <AccordionPrimitive.Item ref={ref} className={cn('border-b', className)} {...props} />
));

const AccordionTrigger = forwardRef<AccordionTriggerRef, AccordionTriggerProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        ref={ref}
        className={cn(
          'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all [&[data-state=closed]>.minus]:hidden [&[data-state=open]>.plus]:hidden',
          className
        )}
        {...props}
      >
        {children}
        <MinusIcon size={18} className="text-gray-500 minus" />
        <PlusIcon size={18} className="text-gray-500 plus" />
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
);

const AccordionContent = forwardRef<AccordionContentRef, AccordionContentProps>(
  ({ className, children, ...props }, ref) => (
    <AccordionPrimitive.Content
      ref={ref}
      className="overflow-hidden text-sm data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
      {...props}
    >
      <div className={cn('pb-4 pt-0', className)}>{children}</div>
    </AccordionPrimitive.Content>
  )
);

AccordionItem.displayName = 'AccordionItem';
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName;
AccordionContent.displayName = AccordionPrimitive.Content.displayName;

export const Accordion = Object.assign(AccordionRoot, {
  Item: AccordionItem,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
});
