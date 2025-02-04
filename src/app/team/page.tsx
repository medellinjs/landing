import Link from "next/link";
import { FaRegEnvelope } from "react-icons/fa";

import Footer from "@/components/Footer";
import { OrganizerCard } from "@/components/OrganizerCard";
import { Navbar } from "@/components/Navbar";
import { teamData } from "@assets/data";
import HeroTeam from "@/components/team/Hero";

export default function Team() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <HeroTeam />

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
        <div className="container relative md:py-24 py-16">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Activos
            </h3>

            <p className="text-slate-400 max-w-xl mx-auto">
              Con un enfoque en la innovación, la inclusión y el aprendizaje
              continuo, ellos son quienes hacen posible que cada charla, taller
              y encuentro sea un espacio de inspiración y crecimiento. ¡Conoce a
              las mentes brillantes que hacen de MedellínJS un referente en la
              comunidad tech!
            </p>
          </div>

          <div className="grid md:grid-cols-12 grid-cols-1 items-center mt-8 gap-8 ">
            {teamData
              .filter((team) => team.isActive)
              .map((item, index) => {
                return (
                  <OrganizerCard
                    key={index}
                    name={item.name}
                    description={item.desc}
                    image={item.image}
                    title={item.title}
                    bgIndex={index}
                    socialNetworks={item.socialNetworks}
                  />
                );
              })}
          </div>
        </div>
      </section>

      <section className="relative pb-32">
        <div className="container relative">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
              Anteriores
            </h3>
          </div>

          <div className="grid md:grid-cols-12 grid-cols-1 items-center gap-8 mb-32">
            {teamData
              .filter((team) => !team.isActive)
              .map((item, index) => {
                return (
                  <OrganizerCard
                    key={index}
                    name={item.name}
                    description={item.desc}
                    image={item.image}
                    title={item.title}
                    bgIndex={index}
                    socialNetworks={item.socialNetworks}
                  />
                );
              })}
          </div>

          <div className="lg:col-span-7 md:col-span-6 text-center mx-auto">
            <div className="mt-6">
              <Link
                href="mailto:info@medellinjs.org"
                className="py-2 px-5 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md me-2 mt-2"
              >
                <FaRegEnvelope className="me-2 text-sm" /> Contáctanos
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
