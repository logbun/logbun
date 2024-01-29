import { Search } from 'lucide-react';
import { forwardRef } from 'react';
import { Form, FormContentProps } from './form';
import { InputBase, InputBaseProps } from './input-base';

export type InputProps = InputBaseProps & Omit<FormContentProps, 'children'>;

const InputRoot = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, helperText, children, ...rest } = props;
  return (
    <Form.Content label={label} helperText={helperText} ref={ref}>
      <span>
        <InputBase autoComplete="off" type="text" {...rest} />
        {children}
      </span>
    </Form.Content>
  );
});

const EmailInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <InputRoot
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

const PasswordInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return <InputRoot ref={ref} type="password" autoComplete="current-password" {...props} />;
});

const SearchInput = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  return (
    <div style={{ minWidth: 300 }}>
      <InputRoot
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

InputRoot.displayName = 'Input';
EmailInput.displayName = 'EmailInput';
PasswordInput.displayName = 'PasswordInput';
SearchInput.displayName = 'SearchInput';

export const Input = Object.assign(InputRoot, {
  Email: EmailInput,
  Password: PasswordInput,
  Search: SearchInput,
});
