import * as React from 'react'
import * as LabelPrimitive from '@radix-ui/react-label'
import { Slot } from '@radix-ui/react-slot'
import {
  Controller,
  ControllerProps,
  FieldPath,
  FieldValues,
  FormProvider,
  useFormContext,
} from 'react-hook-form'

import { cn } from '@/lib/utils'
import { Label } from '@/components/ui/label'

const Form = FormProvider

type FormFieldContextValue<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName
}

const FormFieldContext = React.createContext<FormFieldContextValue | undefined>(undefined)

const FormField = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  ...props
}: ControllerProps<TFieldValues, TName>) => {
  const contextValue = React.useMemo(() => ({ name: props.name }), [props.name])

  return (
    <FormFieldContext.Provider value={contextValue}>
      <Controller {...props} />
    </FormFieldContext.Provider>
  )
}

const useFormField = () => {
  const fieldContext = React.useContext(FormFieldContext)
  const itemContext = React.useContext(FormItemContext)
  const { getFieldState, formState } = useFormContext()

  if (!fieldContext) {
    throw new Error('useFormField debe usarse dentro de un <FormField>')
  }

  const fieldState = getFieldState(fieldContext.name, formState)
  const { id } = itemContext || {}

  return React.useMemo(
    () => ({
      id,
      name: fieldContext.name,
      formItemId: id ? `${id}-form-item` : undefined,
      formDescriptionId: id ? `${id}-form-item-description` : undefined,
      formMessageId: id ? `${id}-form-item-message` : undefined,
      ...fieldState,
    }),
    [id, fieldContext.name, fieldState],
  )
}

type FormItemContextValue = {
  id: string
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue)

const FormItem = React.memo(
  React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    ({ className, ...props }, ref) => {
      const id = React.useId()
      const idMemo = React.useMemo(() => id, [id])

      return (
        <FormItemContext.Provider value={{ id: idMemo }}>
          <div ref={ref} className={cn('space-y-2', className)} {...props} />
        </FormItemContext.Provider>
      )
    },
  ),
)
FormItem.displayName = 'FormItem'

const FormLabel = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
>(({ className, ...props }, ref) => {
  const { error, formItemId } = useFormField()

  return (
    <Label
      ref={ref}
      className={cn(error && 'text-destructive', className)}
      htmlFor={formItemId}
      {...props}
    />
  )
})
FormLabel.displayName = 'FormLabel'

const FormControl = React.memo(
  React.forwardRef<React.ElementRef<typeof Slot>, React.ComponentPropsWithoutRef<typeof Slot>>(
    ({ ...props }, ref) => {
      const { error, formItemId, formDescriptionId, formMessageId } = useFormField()

      const describedBy = React.useMemo(
        () => (error ? `${formDescriptionId} ${formMessageId}` : formDescriptionId),
        [error, formDescriptionId, formMessageId],
      )

      return (
        <Slot
          ref={ref}
          id={formItemId}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          {...props}
        />
      )
    },
  ),
)
FormControl.displayName = 'FormControl'

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField()

  return (
    <p
      ref={ref}
      id={formDescriptionId}
      className={cn('text-muted-foreground text-[0.8rem]', className)}
      {...props}
    />
  )
})
FormDescription.displayName = 'FormDescription'

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, children, ...props }, ref) => {
  const { error, formMessageId } = useFormField()
  const body = error ? String(error?.message) : children

  if (!body) {
    return null
  }

  return (
    <p
      ref={ref}
      id={formMessageId}
      className={cn('text-destructive text-[0.8rem] font-medium', className)}
      {...props}
    >
      {body}
    </p>
  )
})
FormMessage.displayName = 'FormMessage'

export {
  useFormField,
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
  FormField,
}
