import React from 'react';
import Link from 'next/link';
import { MdKeyboardArrowRight } from 'react-icons/md';
import { FaArrowRight } from 'react-icons/fa';

import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import PrintButton from '@/components/PrintButton';

export default function Page() {
  return (
    <>
      <Navbar />

      <section className="relative table w-full bg-gray-50 py-32 dark:bg-slate-800 lg:py-40">
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 text-center">
            <h3 className="text-3xl font-semibold leading-normal">
              Política de Privacidad
            </h3>
          </div>
        </div>
        <div className="absolute bottom-5 end-0 start-0 z-10 mx-3 text-center">
          <ul className="mb-0 inline-flex space-x-1 tracking-[0.5px]">
            <li className="inline-block text-[13px] font-bold uppercase duration-500 ease-in-out hover:text-indigo-600">
              <Link href="/i">MedellinJS</Link>
            </li>
            <li className="mx-0.5 inline-block text-base ltr:rotate-0 rtl:rotate-180">
              <MdKeyboardArrowRight className="text-xl" />
            </li>
            <li
              className="inline-block text-[13px] font-bold uppercase text-indigo-600 duration-500 ease-in-out"
              aria-current="page"
            >
              Política de Privacidad
            </li>
          </ul>
        </div>
      </section>

      <div className="relative">
        <div className="shape absolute -bottom-[2px] end-0 start-0 z-1 overflow-hidden text-white dark:text-slate-900 sm:-bottom-px">
          <svg
            className="h-auto w-full origin-top scale-[2.0]"
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>
      <section className="relative py-16 md:py-24">
        <div className="container relative">
          <div className="justify-center md:flex">
            <div className="md:w-3/4">
              <div className="rounded-md bg-white p-6 shadow dark:bg-slate-900 dark:shadow-gray-800">
                <h5 className="mb-4 text-xl font-semibold">
                  Política de Privacidad:
                </h5>
                <p className="text-slate-400">
                  En MedellinJS, nos tomamos tu privacidad en serio. Esta
                  política explica qué datos recopilamos, cómo los usamos y qué
                  derechos tienes como usuario.
                </p>

                <h5 className="mb-4 mt-8 text-xl font-semibold">
                  ¿Qué datos recopilamos?
                </h5>
                <p className="text-slate-400">
                  Cuando te registras para asistir a un evento, recopilamos:
                </p>
                <ul className="mt-4 list-none text-slate-400">
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Tu nombre
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Tu dirección de correo electrónico
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Tu foto de perfil (según la red social usada)
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    El proveedor de autenticación que usaste (Google o LinkedIn)
                  </li>
                </ul>

                <h5 className="mb-4 mt-8 text-xl font-semibold">
                  ¿Cómo usamos tus datos?
                </h5>
                <p className="text-slate-400">Usamos tu información para:</p>
                <ul className="mt-4 list-none text-slate-400">
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Confirmar tu asistencia a eventos
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Enviarte recordatorios o actualizaciones importantes sobre
                    eventos
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Entender mejor el perfil de nuestra comunidad (de forma
                    agregada y anónima)
                  </li>
                </ul>

                <h5 className="mb-4 mt-8 text-xl font-semibold">
                  Servicios de terceros
                </h5>
                <p className="text-slate-400">
                  Utilizamos servicios de autenticación de Google y LinkedIn.
                  Estos servicios gestionan tu inicio de sesión y nos envían
                  solo la información básica que autorizas compartir.
                </p>
                <p className="text-slate-400">
                  También usamos herramientas de análisis (como Google
                  Analytics) para entender el uso del sitio. Estos datos son
                  anónimos y no se pueden usar para identificarte.
                </p>

                <h5 className="mb-4 mt-8 text-xl font-semibold">
                  Tus derechos
                </h5>
                <p className="text-slate-400">Tienes derecho a:</p>
                <ul className="mt-4 list-none text-slate-400">
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Acceder a tus datos
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Solicitar que eliminemos tu información
                  </li>
                  <li className="mt-2 flex items-center">
                    <FaArrowRight className="me-2 ms-2 align-middle text-[10px] text-indigo-600" />{' '}
                    Revocar el consentimiento para que usemos tus datos
                  </li>
                </ul>
                <p className="text-slate-400">
                  Para ejercer estos derechos, escríbenos a{' '}
                  <Link href="mailto:info@medellinjs.org">
                    info@medellinjs.org
                  </Link>
                  .
                </p>

                <h5 className="mb-4 mt-8 text-xl font-semibold">
                  Cambios a esta política
                </h5>
                <p className="text-slate-400">
                  Podemos actualizar esta política si cambiamos cómo manejamos
                  tus datos. Si hacemos cambios importantes, te lo haremos saber
                  por correo o en el sitio.
                </p>

                <div className="mt-8">
                  <PrintButton />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
