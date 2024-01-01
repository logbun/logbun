import { Search } from 'lucide-react';
import { forwardRef } from 'react';
import { FormControl, FormControlProps } from './form-control';
import { Input, InputProps } from './input';

export type TextInputProps = InputProps & Omit<FormControlProps, 'children'>;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  const { label, name, error, helperText, children, ...rest } = props;

  return (
    <FormControl name={name} label={label} error={error} helperText={helperText}>
      <Input id={name} name={name} ref={ref} autoComplete="off" type="text" {...rest} />
      {children}
    </FormControl>
  );
});

export const EmailInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <TextInput
      ref={ref}
      type="email"
      autoCapitalize="none"
      autoComplete="email"
      autoCorrect="off"
      inputMode="email"
      {...props}
    />
  );
});

export const PasswordInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return <TextInput ref={ref} type="password" autoComplete="current-password" {...props} />;
});

export const SearchInput = forwardRef<HTMLInputElement, TextInputProps>((props, ref) => {
  return (
    <div style={{ minWidth: 300 }}>
      <TextInput
        ref={ref}
        icon={<Search />}
        placeholder="Search"
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        {...props}
      />
    </div>
  );
});

TextInput.displayName = 'TextInput';
EmailInput.displayName = 'EmailInput';
PasswordInput.displayName = 'PasswordInput';
SearchInput.displayName = 'SearchInput';
