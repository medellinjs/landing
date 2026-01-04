'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form, FormControl, FormField, FormItem, FormMessage } from '@components/ui/form'
import { Button } from '@/components/ui/button'
import { Input } from '@components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { newsletterSchema, Newsletter as NewsletterType } from '@/lib/types/newsletter'

export default function Newsletter() {
  const form = useForm({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: NewsletterType) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
      await fetch('/api/subscribe', options)

      form.reset()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <section className="relative table w-full bg-indigo-600 py-36">
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/cta.png')" }}
      ></div>
      <div className="container relative">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="mt-8 lg:mt-0">
            <div className="text-center lg:me-6 lg:text-start">
              <h3 className="mb-4 text-3xl font-semibold leading-normal text-white md:text-4xl lg:leading-normal">
                Suscríbete a Nuestro Newsletter
              </h3>

              <p className="mx-auto max-w-xl text-white/80 lg:ms-auto">
                Recibe actualizaciones sobre eventos, recursos y oportunidades exclusivas.
              </p>
            </div>
          </div>

          <Form {...form}>
            <form className="relative max-w-xl" onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col">
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        className="h-[50px] w-full rounded-full bg-white pb-4 pe-40 ps-6 pt-4 text-black shadow outline-none dark:bg-slate-900 dark:text-white dark:shadow-gray-800"
                        placeholder="Tu correo electrónico:"
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                className="absolute end-[3px] top-[2px] inline-block h-[46px] rounded-full border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white transition duration-500 ease-in-out hover:border-indigo-700 hover:bg-indigo-700"
                disabled={form.formState.isSubmitting}
              >
                <div className="flex items-center justify-center gap-2">
                  {form.formState.isSubmitting ? 'Enviando...' : 'Suscribirse'}
                  <Spinner size="small" show={form.formState.isSubmitting} className="text-white" />
                </div>
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
