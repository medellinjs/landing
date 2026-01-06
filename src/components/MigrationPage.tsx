'use client'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import LoginButton from '@/components/auth/LoginButton'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Spinner } from '@/components/ui/spinner'
import { Button } from '@/components/ui/button'
import { Input } from '@components/ui/input'
import { memberSchema, Member } from '@/lib/types/member'
import { createMember, retrieveMember } from '@/actions/member'

export const MigrationPage = () => {
  const [success, setSuccess] = useState(false)
  const [memberHasAccount, setMemberHasAccount] = useState(false)
  const { data: session } = useSession()

  const defaultValues: Partial<Member> = useMemo(
    () => ({
      nextAuthId: '',
      fullName: '',
      email: '',
      jobPosition: '',
      jobLevel: '',
    }),
    [],
  )

  const form = useForm<Member>({
    resolver: zodResolver(memberSchema),
    defaultValues,
    mode: 'onBlur',
  })

  const {
    handleSubmit,
    control,
    setValue,
    formState: { isValid, isSubmitting, errors },
  } = form

  const onSubmit: SubmitHandler<Member> = async (data) => {
    try {
      const result = await createMember({
        ...data,
        nextAuthId: session?.user?.id ?? '',
      })
      if (result) {
        toast.success('¡Registro exitoso! Gracias por unirte a nuestra comunidad.', {
          duration: 5000,
          position: 'top-center',
        })
        setSuccess(true)
      } else {
        toast.error('Hubo un problema al registrarte. Por favor, intenta de nuevo.')
      }
    } catch (_error) {
      toast.error('Hubo un error en el registro. Por favor, intenta nuevamente.')
    }
  }

  const findMember = useCallback(async () => {
    const member = await retrieveMember(session?.user?.id ?? '')
    if (member) {
      setMemberHasAccount(true)
    }
  }, [session?.user?.id])

  useEffect(() => {
    if (session?.user?.email) {
      findMember()
      setValue('nextAuthId', session.user.id ?? '')
      setValue('email', session.user.email)
      setValue('fullName', session.user.name ?? '')

      if (session.user.image) {
        setValue('profileImage', session.user.image)
      }
    }
  }, [setValue, session?.user, findMember])

  return (
    <>
      {success || memberHasAccount ? (
        <>
          <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
            🎉 ¡Gracias por unirte a nuestra nueva plataforma!
          </h3>

          <p className="max-w-xl text-slate-400">
            Ya eres parte de la comunidad MedellínJS en este nuevo espacio. 🎊 <br />
            Pronto recibirás información sobre nuestros eventos, recursos y oportunidades.
          </p>
          <Link
            className="mt-4 inline-block rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
            href="/events"
          >
            Ver próximos eventos
          </Link>
        </>
      ) : (
        <>
          <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
            Quieres continuar siendo parte de la comunidad MedellínJS?
          </h3>

          <p className="max-w-xl text-slate-400">
            Queremos que sigas recibiendo información sobre nuestros eventos. Solo necesitas
            confirmar tu interés en unos pocos pasos.
          </p>

          {session ? (
            <div className="my-5">
              <p className="max-w-xl pb-5 text-slate-400">
                ¡Casi listo! Solo necesitamos unos datos extra para personalizar tu experiencia en
                MedellínJS. 🚀
              </p>
              <Form {...form}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="grid gap-6 lg:grid-cols-12">
                    <div className="col-span-12 lg:col-span-6">
                      <div className="text-start">
                        <FormField
                          control={control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="mb-4 flex flex-col">
                              <FormLabel className="font-semibold text-slate-400">
                                Correo Electrónico <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  type="email"
                                  className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                                  placeholder="Ingresa tu correo electrónico"
                                  disabled
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                      <div className="text-start">
                        <FormField
                          control={control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem className="mb-4 flex flex-col">
                              <FormLabel className="font-semibold text-slate-400">
                                Nombre Completo <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                                  placeholder="Ingresa tu nombre completo"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                      <div className="text-start">
                        <FormField
                          control={control}
                          name="jobPosition"
                          render={({ field }) => (
                            <FormItem className="mb-4 flex flex-col">
                              <FormLabel className="font-semibold text-slate-400">
                                Rol o Cargo <span className="text-red-500">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input
                                  {...field}
                                  className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                                  placeholder="Ingresa tu rol o cargo"
                                />
                              </FormControl>
                              <FormMessage className="text-red-500" />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="col-span-12 lg:col-span-6">
                      <FormField
                        control={control}
                        name="jobLevel"
                        render={({ field }) => (
                          <FormItem className="mb-4 flex flex-col">
                            <FormLabel className="font-semibold text-slate-400">
                              Senority <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value ? String(field.value) : undefined}
                              >
                                <SelectTrigger className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600">
                                  <SelectValue placeholder="Selecciona una opción" />
                                </SelectTrigger>
                                <SelectContent className="bg-white dark:bg-slate-900">
                                  <SelectItem value="junior">Junior</SelectItem>
                                  <SelectItem value="ssr">Semi Senior</SelectItem>
                                  <SelectItem value="senior">Senior</SelectItem>
                                  <SelectItem value="teachLead">Teach Lead</SelectItem>
                                </SelectContent>
                              </Select>
                            </FormControl>
                            <FormMessage className="text-red-500" />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="flex justify-end lg:col-span-12">
                      <Button
                        className="mt-4 inline-block rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
                        type="submit"
                        id="submit"
                        name="send"
                        disabled={isSubmitting || !isValid}
                      >
                        <div className="flex items-center justify-center gap-2">
                          {isSubmitting ? 'Enviando...' : 'Confirmar mi registro'}
                          <Spinner size="small" show={isSubmitting} className="text-white" />
                        </div>
                      </Button>
                    </div>
                  </div>
                </form>
              </Form>
            </div>
          ) : (
            <div className="mt-6">
              <LoginButton />
            </div>
          )}
        </>
      )}
    </>
  )
}

export default MigrationPage
