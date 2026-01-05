import { Metadata } from 'next'
import { getPublishedEvents } from '@/lib/payload/queries'
import { EventCard } from '@/components/events/EventCard'
import { Navbar } from '@/components/Navbar'
import { MdKeyboardArrowRight } from 'react-icons/md'
import Footer from '@/components/Footer'

export const metadata: Metadata = {
  title: 'Eventos | MedellinJS',
  description:
    'Descubre los próximos eventos de la comunidad MedellinJS. Talleres, charlas y meetups sobre JavaScript y tecnologías web.',
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function EventsPage() {
  // Pass includeUnpublished: true to allow admins/organizers to see unpublished events
  const { docs: events } = await getPublishedEvents({ includeUnpublished: true })

  return (
    <>
      <Navbar navClass="nav-light" />

      <section
        className="relative table w-full bg-red-600 bg-cover bg-center bg-no-repeat py-36 lg:py-44"
        style={{ backgroundImage: "url('/bg1.png')" }}
      >
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-6 text-3xl font-medium leading-normal text-white md:text-4xl md:leading-normal">
              Descubre Nuestros Eventos
            </h3>

            <p className="mx-auto max-w-xl text-lg text-slate-300">
              Únete a la comunidad más activa de JavaScript en Medellín. Talleres, charlas,
              networking y mucho más. ¡Encuentra tu próximo evento!
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 end-0 start-0 z-10 mx-3 text-center">
          <ul className="mx-auto mb-0 inline-flex space-x-1 tracking-[0.5px]">
            <li className="inline-block text-[13px] font-bold uppercase text-white/50 duration-500 ease-in-out hover:text-white">
              Inicio
            </li>
            <li className="mx-0.5 inline-block text-base text-white/50 ltr:rotate-0 rtl:rotate-180">
              <MdKeyboardArrowRight className="text-xl" />
            </li>
            <li
              className="inline-block text-[13px] font-bold uppercase text-white duration-500 ease-in-out"
              aria-current="page"
            >
              Eventos
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

      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          {/* Events Grid */}
          {events.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No hay eventos disponibles</h3>
              <p className="mt-2 text-sm text-gray-500">
                No hay eventos disponibles en este momento. Vuelve pronto para ver los próximos
                eventos de la comunidad.
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </>
  )
}
