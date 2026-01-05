import { Metadata } from 'next'
import { getPublishedEvents } from '@/lib/payload/queries'
import { EventCard } from '@/components/events/EventCard'

export const metadata: Metadata = {
  title: 'Eventos | MedellinJS',
  description:
    'Descubre los próximos eventos de la comunidad MedellinJS. Talleres, charlas y meetups sobre JavaScript y tecnologías web.',
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function EventsPage() {
  const { docs: events } = await getPublishedEvents()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">Eventos de MedellinJS</h1>
          <p className="max-w-3xl text-lg text-gray-600">
            Únete a nuestra comunidad en eventos presenciales y virtuales. Aprende, comparte y
            conecta con otros desarrolladores apasionados por JavaScript.
          </p>
        </div>

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
  )
}
