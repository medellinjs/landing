import Image from 'next/image';
import { MdKeyboardArrowRight } from 'react-icons/md';

import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import MigrationPage from '@/components/MigrationPage';

export default async function Page() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <section
        className="relative table w-full bg-red-600 bg-cover bg-center bg-no-repeat py-36 lg:py-44"
        style={{ backgroundImage: "url('/bg1.png')" }}
      >
        {/* <div className="absolute inset-0 bg-black opacity-75"></div> */}
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 text-3xl font-medium leading-normal text-white md:text-4xl md:leading-normal">
              ¡Nos mudamos a una nueva plataforma de eventos!
            </h3>

            <p className="mx-auto max-w-xl text-lg text-slate-300">
              Seguimos creciendo y queremos que sigas siendo parte de la
              comunidad MedellínJS. Confirma tu interés y no te pierdas nuestros
              próximos eventos.
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 end-0 start-0 z-10 mx-3 text-center">
          <ul className="mx-auto mb-0 inline-flex space-x-1 tracking-[0.5px]">
            <li className="inline-block text-[13px] font-bold uppercase text-white/50 line-through duration-500 ease-in-out hover:text-white">
              Meetup
            </li>
            <li className="mx-0.5 inline-block text-base text-white/50 ltr:rotate-0 rtl:rotate-180">
              <MdKeyboardArrowRight className="text-xl" />
            </li>
            <li
              className="inline-block text-[13px] font-bold uppercase text-white duration-500 ease-in-out"
              aria-current="page"
            >
              Nuestra Plataforma 🚀
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
          <div className="grid grid-cols-1 items-center gap-[30px] md:grid-cols-12">
            <div className="md:col-span-6 lg:col-span-5">
              <div className="grid grid-cols-12 items-center gap-6">
                <div className="col-span-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Image
                      src="/meetup01.jpeg"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="rounded-md shadow"
                      alt=""
                    />
                    <Image
                      src="/meetup03.png"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="rounded-md shadow"
                      alt=""
                    />
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="grid grid-cols-1 gap-6">
                    <Image
                      src="/meetup02.jpeg"
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="rounded-md shadow"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="md:col-span-6 lg:col-span-7">
              <div className="lg:ms-5">
                <MigrationPage />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
