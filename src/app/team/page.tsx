import Link from 'next/link';
import { FaRegEnvelope } from 'react-icons/fa';

import Footer from '@/components/Footer';
import { OrganizerCard } from '@/components/OrganizerCard';
import { Navbar } from '@/components/Navbar';
import { teamData } from '@assets/data';
import HeroTeam from '@/components/team/Hero';

export default function Team() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <HeroTeam />

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
        <div className="container relative py-16 md:py-24">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              Activos
            </h3>

            <p className="mx-auto max-w-xl text-slate-400">
              Con un enfoque en la innovación, la inclusión y el aprendizaje
              continuo, ellos son quienes hacen posible que cada charla, taller
              y encuentro sea un espacio de inspiración y crecimiento. ¡Conoce a
              las mentes brillantes que hacen de MedellínJS un referente en la
              comunidad tech!
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
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
            <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              Anteriores
            </h3>
          </div>

          <div className="mb-32 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
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

          <div className="mx-auto text-center md:col-span-6 lg:col-span-7">
            <div className="mt-6">
              <Link
                href="mailto:info@medellinjs.org"
                className="me-2 mt-2 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
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
