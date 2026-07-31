import { forwardRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import type { UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form';
import { FormProvider, useForm } from 'react-hook-form';
import type { ZodType } from 'zod';
import { cn } from '@/lib/utils';

type FormWrapperProps<TFormValues extends FieldValues> = {
  schema: ZodType<TFormValues>;
  defaultValues?: DefaultValues<TFormValues>;
  onSubmit: (values: TFormValues) => void | Promise<void>;
  onError?: (errors: Record<string, unknown>) => void;
  className?: string;
  children: (form: UseFormReturn<TFormValues>) => React.ReactNode;
};

export function FormWrapper<TFormValues extends FieldValues>(
  { schema, defaultValues, onSubmit, onError, className, children }: FormWrapperProps<TFormValues>,
  ref: React.Ref<HTMLFormElement>,
) {
  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onTouched',
  });

  return (
    <FormProvider {...form}>
      <form
        ref={ref}
        onSubmit={form.handleSubmit(async (values) => onSubmit(values), (errors) => onError?.(errors as Record<string, unknown>))}
        className={cn('flex flex-col gap-4', className)}
        noValidate
      >
        {children(form)}
      </form>
    </FormProvider>
  );
}

export const FormWrapperForwarded = forwardRef(FormWrapper) as <TFormValues extends FieldValues>(
  props: FormWrapperProps<TFormValues> & { ref?: React.Ref<HTMLFormElement> },
) => React.ReactElement;

export default FormWrapperForwarded;
