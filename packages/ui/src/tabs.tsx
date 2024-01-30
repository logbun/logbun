'use client';

import { cn } from '@logbun/utils';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { forwardRef } from 'react';

type TabsListRef = React.ElementRef<typeof TabsPrimitive.List>;
type TabsListProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>;
type TabsTriggerRef = React.ElementRef<typeof TabsPrimitive.Trigger>;
type TabsTriggerProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>;
type TabsContentRef = React.ElementRef<typeof TabsPrimitive.Content>;
type TabsContentProps = React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>;

const TabsRoot = TabsPrimitive.Root;

const TabsList = forwardRef<TabsListRef, TabsListProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn('inline-flex h-9 items-center justify-center rounded-lg bg-gray-100 p-1 text-gray-900', className)}
    {...props}
  />
));

const TabsTrigger = forwardRef<TabsTriggerRef, TabsTriggerProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(
      'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-900 data-[state=active]:shadow',
      className
    )}
    {...props}
  />
));

const TabsContent = forwardRef<TabsContentRef, TabsContentProps>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      'mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
      className
    )}
    {...props}
  />
));

TabsContent.displayName = TabsPrimitive.Content.displayName;
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;
TabsList.displayName = TabsPrimitive.List.displayName;

export const Tabs = Object.assign(TabsRoot, {
  Trigger: TabsTrigger,
  Content: TabsContent,
  List: TabsList,
});
