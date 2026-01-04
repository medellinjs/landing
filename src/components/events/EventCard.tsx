import Link from 'next/link'
import Image from 'next/image'
import type { Event, Media } from '@/payload-types'

interface EventCardProps {
  event: Event
}

function formatDate(dateString: string, timezone: string = 'America/Bogota'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(date)
}

function isEventPast(dateString: string): boolean {
  return new Date(dateString) < new Date()
}

export function EventCard({ event }: EventCardProps) {
  const isPast = isEventPast(event.startDate)
  const previewImage = event.previewImage as Media | undefined
  const imageUrl = previewImage?.url || '/placeholder-event.jpg'

  return (
    <Link
      href={`/events/${event.slug}`}
      className={`group block overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl ${
        isPast ? 'opacity-75' : ''
      }`}
    >
      <div className="relative aspect-video w-full bg-gray-200">
        <Image
          src={imageUrl}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Show "Borrador" badge for unpublished events */}
        {!event.isPublished && (
          <div className="absolute left-4 top-4 rounded-full bg-orange-500 px-3 py-1 text-sm font-medium text-white">
            Borrador
          </div>
        )}
        {isPast && (
          <div className="absolute right-4 top-4 rounded-full bg-gray-800 px-3 py-1 text-sm font-medium text-white">
            Finalizado
          </div>
        )}
        {!isPast && event.featured && event.isPublished && (
          <div className="absolute right-4 top-4 rounded-full bg-yellow-500 px-3 py-1 text-sm font-medium text-black">
            Destacado
          </div>
        )}
      </div>

      <div className="bg-white p-6">
        <h3 className="mb-2 text-xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {event.title}
        </h3>

        <div className="mb-2 flex items-center text-sm text-gray-600">
          <svg
            className="mr-2 h-4 w-4"
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
          {formatDate(event.startDate, event.timezone)}
        </div>

        {typeof event.venue === 'object' && event.venue?.name && (
          <div className="mb-3 flex items-center text-sm text-gray-600">
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            {event.venue.name}
          </div>
        )}
      </div>
    </Link>
  )
}
