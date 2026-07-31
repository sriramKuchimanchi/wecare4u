import { forwardRef } from 'react';
import type { ControllerProps } from 'react-hook-form';
import { useFormContext, Controller } from 'react-hook-form';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type BaseFieldProps = {
  name: string;
  label: string;
  hint?: string;
  required?: boolean;
  className?: string;
};

export const FieldError = ({ message }: { message?: string }) =>
  message ? <p className="mt-1 text-xs text-destructive">{message}</p> : null;

export const TextField = forwardRef<HTMLInputElement, BaseFieldProps & React.InputHTMLAttributes<HTMLInputElement>>(
  ({ name, label, hint, required, className, ...rest }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Label htmlFor={name} className="text-sm font-medium">
          {label}{required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Input id={name} {...register(name)} ref={ref} aria-invalid={Boolean(error)} {...rest} />
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        <FieldError message={error} />
      </div>
    );
  },
);
TextField.displayName = 'TextField';

export const TextAreaField = forwardRef<HTMLTextAreaElement, BaseFieldProps & React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ name, label, hint, required, className, ...rest }, ref) => {
    const { register, formState: { errors } } = useFormContext();
    const error = errors[name]?.message as string | undefined;
    return (
      <div className={cn('flex flex-col gap-1.5', className)}>
        <Label htmlFor={name} className="text-sm font-medium">
          {label}{required && <span className="ml-0.5 text-destructive">*</span>}
        </Label>
        <Textarea id={name} {...register(name)} ref={ref} aria-invalid={Boolean(error)} {...rest} />
        {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
        <FieldError message={error} />
      </div>
    );
  },
);
TextAreaField.displayName = 'TextAreaField';

type SelectFieldProps = BaseFieldProps & {
  options: { value: string; label: string }[];
  placeholder?: string;
};

export const SelectField = ({ name, label, hint, required, options, placeholder, className }: SelectFieldProps) => {
  const { control, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label htmlFor={name} className="text-sm font-medium">
        {label}{required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <select
            id={name}
            value={field.value ?? ''}
            onChange={field.onChange}
            onBlur={field.onBlur}
            aria-invalid={Boolean(error)}
            className="h-10 rounded-md border border-input bg-surface px-3 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/30"
          >
            {placeholder && <option value="">{placeholder}</option>}
            {options.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}
      />
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
};

type CheckboxFieldProps = BaseFieldProps & {
  checkboxLabel: string;
};

export const CheckboxField = ({ name, label, hint, checkboxLabel, className }: CheckboxFieldProps) => {
  const { register, formState: { errors } } = useFormContext();
  const error = errors[name]?.message as string | undefined;
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      <Label className="text-sm font-medium">{label}</Label>
      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" {...register(name)} className="mt-0.5 h-4 w-4 rounded border-input text-primary focus:ring-ring" />
        <span>{checkboxLabel}</span>
      </label>
      {hint && !error && <p className="text-xs text-muted-foreground">{hint}</p>}
      <FieldError message={error} />
    </div>
  );
};
