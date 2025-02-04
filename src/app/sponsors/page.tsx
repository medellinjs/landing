import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  ServiceFaq,
  SponsorPlan,
  SponsorQuotes,
} from "@/components/sponsors/index";
import Sponsors from "@/components/Sponsors";
import GetInTuct from "@/components/GetInTuct";

export default function SponsorsPage() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <section
        className="relative table w-full py-36 lg:py-44 bg-no-repeat bg-center bg-cover bg-violet-600"
        style={{ backgroundImage: "url('/bg2.png')" }}
      >
        <div className="container relative">
          <div className="grid grid-cols-1 pb-8 text-center mt-10">
            <h1 className="font-bold lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5 text-white">
              Patrocina MedellinJS
            </h1>

            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              Ofrecemos oportunidades personalizadas para que tu empresa tenga
              visibilidad, construya relaciones significativas y demuestre su
              compromiso con el ecosistema tecnológico local.
            </p>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="shape absolute sm:-bottom-px -bottom-[2px] start-0 end-0 overflow-hidden z-1 text-white dark:text-slate-900">
          <svg
            className="w-full h-auto scale-[2.0] origin-top"
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

      <section className="relative md:py-24 py-16">
        <SponsorQuotes />
      </section>

      <Sponsors hideCTA />

      <section className="relative md:py-24 py-16">
        <div className="container relative">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">
              Paquetes de Patrocinio
            </h3>

            <p className="text-slate-400 max-w-xl mx-auto">
              Con nuestros Paquetes de Patrocinio, tu marca puede conectarse con
              desarrolladores, innovadores y líderes de la industria mientras
              apoyas el crecimiento y la educación en tecnología.
            </p>
          </div>

          <SponsorPlan />
        </div>

        <div className="container relative md:py-24 py-16">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold">
              Preguntas frecuentes
            </h3>

            <p className="text-slate-400 max-w-xl mx-auto">
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
