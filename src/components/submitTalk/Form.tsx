'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@components/ui/input';
import { Textarea } from '@components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { submitTalkFormSchema, SubmitTalkFormType } from '@/lib/types/talks';

export const SubmitTalkForm = () => {
  const [isSuccessVisible, setIsSuccessVisible] = useState(false);
  const scrollToElement = () => {
    window.scrollTo({ top: 350, left: 0, behavior: 'smooth' });
  };

  const form = useForm({
    resolver: zodResolver(submitTalkFormSchema),
    defaultValues: {
      speaker: {
        fullName: '',
        email: '',
        role: '',
        profileImage: '',
        bio: '',
      },
      talk: {
        title: '',
        description: '',
        level: '',
        type: '',
      },
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SubmitTalkFormType) => {
    try {
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      await fetch('/api/talk', options);

      scrollToElement();
      form.reset();
      setIsSuccessVisible(true);
      setTimeout(() => {
        setIsSuccessVisible(false);
      }, 3000);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error:', error);
    }
  };

  return (
    <Form {...form}>
      <div
        className={`transition-all duration-500 ${
          isSuccessVisible ? 'block opacity-100' : 'hidden opacity-0'
        }`}
      >
        <h3 className="mb-6 text-center text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
          Gracias por tu propuesta! 🎉
        </h3>
      </div>

      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={isSuccessVisible ? 'hidden' : 'block'}
      >
        <h4 className="my-4 text-2xl font-medium leading-normal md:text-3xl lg:leading-normal">
          Ponente
        </h4>
        <div className="mb-12 rounded-md bg-white p-6 shadow dark:bg-slate-900 dark:shadow-gray-800">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="text-start">
                <FormField
                  control={form.control}
                  name="speaker.fullName"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="font-semibold">
                        Nombre Completo <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                          placeholder="Ingresa tu nombre completo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="text-start">
                <FormField
                  control={form.control}
                  name="speaker.email"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="font-semibold">
                        Correo Electrónico{' '}
                        <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                          placeholder="Ingresa tu correo electrónico"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="text-start">
                <FormField
                  control={form.control}
                  name="speaker.role"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="font-semibold">
                        Rol o Cargo <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                          placeholder="Ingresa tu rol o cargo"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <FormField
                control={form.control}
                name="speaker.profileImage"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col">
                    <FormLabel className="font-semibold">
                      Imagen <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                        placeholder="https://example.com/image.jpg"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:col-span-12">
              <div className="text-start">
                <FormField
                  control={form.control}
                  name="speaker.bio"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="font-semibold">
                        Breve Biografía <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="form-input mt-3 h-28 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                          placeholder="Inspirate para darnos tu biografía"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <h4 className="my-4 text-2xl font-medium leading-normal md:text-3xl lg:leading-normal">
          Charla/Taller
        </h4>
        <div className="mb-8 rounded-md bg-white p-6 shadow dark:bg-slate-900 dark:shadow-gray-800">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="lg:col-span-12">
              <div className="text-start">
                <FormField
                  control={form.control}
                  name="talk.title"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="font-semibold">
                        Título <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                          placeholder="Ingresa el título de tu charla/taller"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="lg:col-span-6">
              <FormField
                control={form.control}
                name="talk.type"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col">
                    <FormLabel className="font-semibold">
                      Tipo de presentación:{' '}
                      <span className="text-red-500">*</span>
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
                          <SelectItem value="charla">
                            Charla (30-45 minutos)
                          </SelectItem>
                          <SelectItem value="taller">
                            Taller (1-2 horas)
                          </SelectItem>
                          <SelectItem value="lightning">
                            Lightning Talk (5-10 minutos)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:col-span-6">
              <FormField
                control={form.control}
                name="talk.level"
                render={({ field }) => (
                  <FormItem className="mb-4 flex flex-col">
                    <FormLabel className="font-semibold">
                      Nivel de la presentación{' '}
                      <span className="text-red-500">*</span>
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
                          <SelectItem value="principiante">
                            Principiante
                          </SelectItem>
                          <SelectItem value="intermedio">Intermedio</SelectItem>
                          <SelectItem value="avanzado">Avanzado</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
            </div>

            <div className="lg:col-span-12">
              <div className="text-start">
                <FormField
                  control={form.control}
                  name="talk.description"
                  render={({ field }) => (
                    <FormItem className="mb-4 flex flex-col">
                      <FormLabel className="font-semibold">
                        Descripción <span className="text-red-500">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          className="form-input mt-3 h-28 w-full rounded border border-gray-200 bg-white px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                          placeholder="Cautiva a los asistentes con tu descripción"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end lg:col-span-12">
              <Button
                className="mt-4 inline-block rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
                type="submit"
                id="submit"
                name="send"
                disabled={
                  form.formState.isSubmitting || !form.formState.isValid
                }
              >
                <div className="flex items-center justify-center gap-2">
                  {form.formState.isSubmitting
                    ? 'Enviando propuesta...'
                    : 'Enviar Propuesta'}
                  <Spinner
                    size="small"
                    show={form.formState.isSubmitting}
                    className="text-white"
                  />
                </div>
              </Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default SubmitTalkForm;
