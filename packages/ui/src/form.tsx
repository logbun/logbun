'use client';

import { cn } from '@logbun/utils';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';
import { Children, cloneElement, createContext, forwardRef, isValidElement, useContext, useId } from 'react';
import { Controller, ControllerProps, FieldPath, FieldValues, FormProvider, useFormContext } from 'react-hook-form';
import { Label, labelVariants } from './label';

export type FormContentProps = {
  label?: string;
  helperText?: string;
  children: React.ReactNode;
};

type FormItemRef = HTMLDivElement;
type FormItemProps = React.HTMLAttributes<HTMLDivElement>;

type FormContentRef = HTMLDivElement;

type FormLabelRef = React.ElementRef<typeof LabelPrimitive.Root>;
type FormLabelProps = React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>;

type FormControlRef = React.ElementRef<typeof Slot>;
type FormControlProps = React.ComponentPropsWithoutRef<typeof Slot>;

type FormDescriptionRef = HTMLParagraphElement;
type FormDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

type FormMessageRef = HTMLParagraphElement;
type FormMessageProps = React.HTMLAttributes<HTMLParagraphElement>;

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
};
type FormItemContextValue = { id: string };

const FormFieldContext = createContext<FormFieldContextValue>({} as FormFieldContextValue);

const FormItemContext = createContext<FormItemContextValue>({} as FormItemContextValue);

const FormRoot = FormProvider;

const useFormField = () => {
  const fieldContext = useContext(FormFieldContext);
  const itemContext = useContext(FormItemContext);
  const { getFieldState, formState } = useFormContext();

  const fieldState = getFieldState(fieldContext.name, formState);

  if (!fieldContext) {
    throw new Error('useFormField should be used within <FormField>');
  }

  const { id } = itemContext;

  return {
    id,
    name: fieldContext.name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
};

const FormFieldController = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  return (
    <FormFieldContext.Provider value={{ name: props.name }}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  );
};

const FormItem = forwardRef<FormItemRef, FormItemProps>(({ className, ...props }, ref) => {
  const id = useId();
  return (
    <FormItemContext.Provider value={{ id }}>
      <div ref={ref} className={cn('space-y-0.5', className)} {...props} />
    </FormItemContext.Provider>
  );
});

const FormLabel = forwardRef<FormLabelRef, FormLabelProps>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField();
  return <Label ref={ref} className={cn(error && 'text-destructive', className)} htmlFor={formItemId} {...props} />;
});

const FormControl = forwardRef<FormControlRef, FormControlProps>(({ ...props }, ref) => {
  const { error, formItemId, formDescriptionId, formMessageId } = useFormField();

  return (
    <Slot
      ref={ref}
      id={formItemId}
      aria-describedby={!error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`}
      aria-invalid={!!error}
      {...props}
    />
  );
});

const FormDescription = forwardRef<FormDescriptionRef, FormDescriptionProps>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();
  return (
    <p ref={ref} id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />
  );
});

const FormMessage = forwardRef<FormMessageRef, FormMessageProps>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField();

  const body = error ? String(error?.message) : children;

  if (!body) return null;

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn(labelVariants(), `${error ? 'text-red-500' : ''} text-xs`, className)}
      {...props}
    >
      {body}
    </p>
  );
});

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  children,
  ...rest
}: Omit<ControllerProps<TFieldValues, TName>, 'render'> & { children: React.ReactNode }) => {
  return (
    <FormFieldController
      {...rest}
      render={({ field }) => {
        const childrenWithProps = Children.map(children, (child) => {
          if (isValidElement(child)) {
            return cloneElement(child, field);
          }
          return child;
        });

        return <>{childrenWithProps}</>;
      }}
    />
  );
};

const FormContent = forwardRef<FormContentRef, FormContentProps>((props, ref) => {
  const { label, helperText, children } = props;
  return (
    <Form.Item ref={ref}>
      {label && <Form.Label>{label}</Form.Label>}
      <Form.Control>{children}</Form.Control>
      <FormMessage />
      {helperText && <Form.Description>{helperText}</Form.Description>}
    </Form.Item>
  );
});

FormMessage.displayName = 'FormMessage';
FormDescription.displayName = 'FormDescription';
FormControl.displayName = 'FormControl';
FormLabel.displayName = 'FormLabel';
FormItem.displayName = 'FormItem';
FormField.displayName = 'FormField';
FormContent.displayName = 'FormContent';

export const Form = Object.assign(FormRoot, {
  Control: FormControl,
  Description: FormDescription,
  FieldController: FormFieldController,
  Item: FormItem,
  Label: FormLabel,
  Message: FormMessage,
  Field: FormField,
  Content: FormContent,
});

export { useFormField };
