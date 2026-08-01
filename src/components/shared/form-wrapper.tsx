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

export function FormWrapper<TFormValues extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  onError,
  className,
  children,
}: FormWrapperProps<TFormValues>) {
  const form = useForm<TFormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onSubmit',
  });

  return (
    <FormProvider {...form}>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(
            async (values) => onSubmit(values),
            (errors) => onError?.(errors as Record<string, unknown>),
          )(e);
        }}
        className={cn('flex flex-col gap-4', className)}
        noValidate
      >
        {children(form)}
      </form>
    </FormProvider>
  );
}

export default FormWrapper;
