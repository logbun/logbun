'use client';

import { Menu as HeadlessMenu, Listbox, Transition } from '@headlessui/react';
import { cn } from '@logbun/utils';
import { ChevronDown } from 'lucide-react';
import { Fragment, ReactElement, ReactNode, forwardRef } from 'react';
import { buttonVariants } from '.';
import { labelVariants } from './label';
import { ExtractProps } from './types';

type SelectButtonRootProps = ExtractProps<typeof HeadlessMenu.Button>;

type SelectButtonProps = ExtractProps<typeof Listbox.Button> & {
  children: ReactNode;
};

type SelectLabelProps = ExtractProps<typeof Listbox.Label> & {
  children: ReactNode;
};

type SelectOptionProps = ExtractProps<typeof Listbox.Option> & {
  children: ReactNode | ((bag: { selected: boolean }) => ReactElement);
};

type SelectOptionsProps = ExtractProps<typeof Listbox.Options>;

type SelectProps = SelectButtonRootProps & {
  value: string | number;
  label: ReactElement<SelectLabelProps>;
  button: ReactElement<SelectButtonProps>;
  children: ReactElement<SelectOptionsProps>;
};

const SelectOptions = forwardRef<HTMLDivElement, SelectOptionsProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Listbox.Options
      ref={ref}
      className={cn(
        'absolute z-10 w-full py-1 mt-1 overflow-auto text-base bg-white rounded-md shadow-lg max-h-56 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm',
        className
      )}
      {...rest}
    />
  );
});

const SelectOption = forwardRef<HTMLLIElement, SelectOptionProps>((props, ref) => {
  const { className, ...rest } = props;
  return (
    <Listbox.Option
      ref={ref}
      className={({ active }: { active: boolean }) =>
        cn(active ? 'bg-slate-100' : '', 'relative cursor-default select-none py-2 pl-3 pr-9 text-slate-900', className)
      }
      {...rest}
    />
  );
});

const SelectLabel = forwardRef<HTMLLabelElement, SelectLabelProps>((props, ref) => {
  const { children, className, ...rest } = props;
  return (
    <Listbox.Label ref={ref} className={cn(labelVariants(), className)} {...rest}>
      {children}
    </Listbox.Label>
  );
});

const SelectButton = forwardRef<HTMLButtonElement, SelectButtonProps>((props, ref) => {
  const { children, className } = props;
  return (
    <Listbox.Button
      ref={ref}
      className={cn(buttonVariants({ variant: 'secondary' }), 'w-full justify-start cursor-default', className)}
    >
      {children}
      <span className="absolute inset-y-0 right-0 flex items-center pr-2 ml-3 pointer-events-none">
        <ChevronDown className="w-5 h-5 text-slate-400" aria-hidden="true" />
      </span>
    </Listbox.Button>
  );
});

const SelectRoot = forwardRef<HTMLButtonElement, SelectProps>((props, ref) => {
  const { label, children, button, ...rest } = props;
  return (
    <Listbox {...rest} ref={ref}>
      {({ open }) => (
        <div className="space-y-0.5">
          {label}
          <div className="relative">
            {button}
            <Transition
              show={open}
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {children}
            </Transition>
          </div>
        </div>
      )}
    </Listbox>
  );
});

export const Select = Object.assign(SelectRoot, {
  Button: SelectButton,
  Label: SelectLabel,
  Option: SelectOption,
  Options: SelectOptions as any,
});
