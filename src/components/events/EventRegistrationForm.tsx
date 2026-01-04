'use client'

import { useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { memberSchema, Member } from '@/lib/types/member'

export interface EventRegistrationFormProps {
  onSuccess: (member: Member) => void
  onError?: (error: Error) => void
  isSubmitting?: boolean
}

export function EventRegistrationForm({
  onSuccess,
  onError,
  isSubmitting: externalSubmitting,
}: EventRegistrationFormProps) {
  const { data: session } = useSession()

  const form = useForm<Member>({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      nextAuthId: '',
      fullName: '',
      email: '',
      jobPosition: '',
      jobLevel: '',
      profileImage: '',
    },
    mode: 'onBlur',
  })

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isSubmitting },
  } = form

  // Pre-fill form with session data
  useEffect(() => {
    if (session?.user) {
      if (session.user.id) setValue('nextAuthId', session.user.id)
      if (session.user.email) setValue('email', session.user.email)
      if (session.user.name) setValue('fullName', session.user.name)
      if (session.user.image) setValue('profileImage', session.user.image)
    }
  }, [session, setValue])

  const onSubmit: SubmitHandler<Member> = async (data) => {
    try {
      onSuccess(data)
    } catch (error) {
      if (onError) {
        onError(error instanceof Error ? error : new Error('Unknown error'))
      }
    }
  }

  const formSubmitting = isSubmitting || externalSubmitting

  return (
    <Form {...form}>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid gap-4 sm:gap-6 lg:grid-cols-12">
          {/* Email Field - Disabled */}
          <div className="col-span-12 lg:col-span-6">
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-3 flex flex-col sm:mb-4">
                  <FormLabel className="text-sm font-semibold text-slate-400 sm:text-base">
                    Correo Electrónico <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="form-input mt-2 h-10 w-full min-w-0 rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600 sm:text-base"
                      placeholder="tu@email.com"
                      disabled
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Full Name Field */}
          <div className="col-span-12 lg:col-span-6">
            <FormField
              control={control}
              name="fullName"
              render={({ field }) => (
                <FormItem className="mb-3 flex flex-col sm:mb-4">
                  <FormLabel className="text-sm font-semibold text-slate-400 sm:text-base">
                    Nombre Completo <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="form-input mt-2 h-10 w-full min-w-0 rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600 sm:text-base"
                      placeholder="Tu nombre completo"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Job Position Field */}
          <div className="col-span-12 lg:col-span-6">
            <FormField
              control={control}
              name="jobPosition"
              render={({ field }) => (
                <FormItem className="mb-3 flex flex-col sm:mb-4">
                  <FormLabel className="text-sm font-semibold text-slate-400 sm:text-base">
                    Rol o Cargo <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="form-input mt-2 h-10 w-full min-w-0 rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600 sm:text-base"
                      placeholder="Ej: Frontend Developer"
                    />
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Job Level Field */}
          <div className="col-span-12 lg:col-span-6">
            <FormField
              control={control}
              name="jobLevel"
              render={({ field }) => (
                <FormItem className="mb-3 flex flex-col sm:mb-4">
                  <FormLabel className="text-sm font-semibold text-slate-400 sm:text-base">
                    Seniority <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value ? String(field.value) : undefined}
                    >
                      <SelectTrigger className="form-input mt-2 h-10 w-full min-w-0 rounded border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600 sm:text-base">
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
                      <SelectContent className="bg-white dark:bg-slate-900">
                        <SelectItem value="junior">Junior</SelectItem>
                        <SelectItem value="ssr">Semi Senior</SelectItem>
                        <SelectItem value="senior">Senior</SelectItem>
                        <SelectItem value="teachLead">Tech Lead</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage className="text-xs text-red-500 sm:text-sm" />
                </FormItem>
              )}
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-12 mt-2 flex w-full justify-end">
            <Button
              className="w-full rounded-md border border-indigo-600 bg-indigo-600 px-4 py-2 text-center text-sm font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700 sm:w-auto sm:px-5 sm:text-base"
              type="submit"
              disabled={formSubmitting || !isValid}
            >
              <div className="flex items-center justify-center gap-2">
                {formSubmitting ? 'Enviando...' : 'Confirmar mi registro'}
                <Spinner size="small" show={formSubmitting} className="text-white" />
              </div>
            </Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
