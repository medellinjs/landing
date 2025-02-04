import { Navbar } from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  ServiceFaq,
  SponsorPlan,
  SponsorQuotes,
} from '@/components/sponsors/index';
import Sponsors from '@/components/Sponsors';
import GetInTuct from '@/components/GetInTuct';

export default function SponsorsPage() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <section
        className="relative table w-full bg-violet-600 bg-cover bg-center bg-no-repeat py-36 lg:py-44"
        style={{ backgroundImage: "url('/bg2.png')" }}
      >
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 pb-8 text-center">
            <h1 className="mb-5 text-4xl font-bold leading-normal text-white lg:text-5xl lg:leading-normal">
              Patrocina MedellinJS
            </h1>

            <p className="mx-auto max-w-xl text-lg text-slate-300">
              Ofrecemos oportunidades personalizadas para que tu empresa tenga
              visibilidad, construya relaciones significativas y demuestre su
              compromiso con el ecosistema tecnológico local.
            </p>
          </div>
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
        <SponsorQuotes />
      </section>

      <Sponsors hideCTA />

      <section className="relative py-16 md:py-24">
        <div className="container relative">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              Paquetes de Patrocinio
            </h3>

            <p className="mx-auto max-w-xl text-slate-400">
              Con nuestros Paquetes de Patrocinio, tu marca puede conectarse con
              desarrolladores, innovadores y líderes de la industria mientras
              apoyas el crecimiento y la educación en tecnología.
            </p>
          </div>

          <SponsorPlan />
        </div>

        <div className="container relative py-16 md:py-24">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              Preguntas frecuentes
            </h3>

            <p className="mx-auto max-w-xl text-slate-400">
              ¿Quieres patrocinar y aportar a una de las comunidades tech más
              vibrantes de Medellín?
            </p>
          </div>

          <ServiceFaq />
        </div>

        <GetInTuct />
      </section>

      <Footer />
    </>
  );
}
