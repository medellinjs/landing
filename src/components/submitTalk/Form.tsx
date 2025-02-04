'use client';
import { useState } from 'react';

import { Input } from '@components/ui/input';

export const SubmitTalkForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    talkTitle: '',
    talkType: '',
    talkDescription: '',
    speakerBio: '',
    technologyLevel: '',
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar los datos del formulario
    console.log(formData);
    alert('Propuesta enviada con éxito!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h4 className="my-4 text-2xl font-medium leading-normal md:text-3xl lg:leading-normal">
        Ponente
      </h4>
      <div className="mb-12 rounded-md bg-white p-6 shadow dark:bg-slate-900 dark:shadow-gray-800">
        <div className="grid gap-6 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <div className="text-start">
              <label htmlFor="name" className="font-semibold">
                Nombre Completo
              </label>
              <Input
                name="name"
                id="name"
                type="text"
                className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                placeholder="Nombre Completo :"
                required
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="text-start">
              <label htmlFor="email" className="font-semibold">
                Correo Electrónico:
              </label>
              <Input
                name="email"
                id="email"
                type="email"
                className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                placeholder="Correo Electrónico :"
                required
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="text-start">
              <label htmlFor="role" className="font-semibold">
                Rol o Cargo
              </label>
              <Input
                name="role"
                id="role"
                type="text"
                className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                placeholder="Role :"
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <label className="font-semibold" htmlFor="profileImage">
              Imagen
            </label>
            <input
              className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
              id="profileImage"
              type="url"
              placeholder="Url de la imagen del Ponente :"
            />
          </div>

          <div className="lg:col-span-12">
            <div className="text-start">
              <label htmlFor="speakerBio" className="font-semibold">
                Breve Biografía
              </label>
              <textarea
                name="speakerBio"
                id="speakerBio"
                className="form-input mt-3 h-28 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                placeholder="Biografía :"
              ></textarea>
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
              <label htmlFor="talkTitle" className="font-semibold">
                Título
              </label>
              <Input
                name="talkTitle"
                id="talkTitle"
                className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                placeholder="Titulo :"
                type="text"
                required
              />
            </div>
          </div>

          <div className="lg:col-span-6">
            <label htmlFor="talkType" className="font-semibold">
              Tipo de Presentación:
            </label>
            <select
              id="talkType"
              required
              onChange={handleChange}
              className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
            >
              <option value="">Selecciona una opción</option>
              <option value="charla">Charla (30-45 minutos)</option>
              <option value="taller">Taller (1-2 horas)</option>
              <option value="lightning">Lightning Talk (5-10 minutos)</option>
            </select>
          </div>

          <div className="lg:col-span-6">
            <label htmlFor="technologyLevel" className="font-semibold">
              Nivel
            </label>
            <select
              id="technologyLevel"
              required
              onChange={handleChange}
              className="form-input mt-3 h-10 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
            >
              <option value="">Selecciona una opción</option>
              <option value="principiante">Principiante</option>
              <option value="intermedio">Intermedio</option>
              <option value="avanzado">Avanzado</option>
            </select>
          </div>

          <div className="lg:col-span-12">
            <div className="text-start">
              <label htmlFor="talkDescription" className="font-semibold">
                Descripción
              </label>
              <textarea
                name="talkDescription"
                id="talkDescription"
                className="form-input mt-3 h-28 w-full rounded border border-gray-200 bg-transparent px-3 py-2 outline-none focus:border-indigo-600 focus:ring-0 dark:border-gray-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:border-indigo-600"
                placeholder="Descripción :"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end lg:col-span-12">
            <button
              type="submit"
              id="submit"
              name="send"
              className="mt-4 inline-block rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
            >
              Enviar Propuesta
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default SubmitTalkForm;
