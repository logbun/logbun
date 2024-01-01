import { cn } from '@logbun/utils';
import { Label } from './label';

export interface FormControlProps {
  name?: string;
  label?: string;
  error?: boolean;
  helperText?: string;
  children: React.ReactNode;
}

export const FormControl = (props: FormControlProps) => {
  const { name, label, error, helperText, children } = props;

  return (
    <div className="space-y-0.5">
      {label && <Label htmlFor={name}>{label}</Label>}
      <div className="relative">{children}</div>
      {helperText && (
        <Label
          id={`${name}-helper-${error ? 'error' : 'text'}`}
          className={cn('text-xs whitespace-pre-line', {
            ['text-red-500']: error,
            ['text-slate-500']: !error,
          })}
        >
          {helperText}
        </Label>
      )}
    </div>
  );
};
