import { EventCard } from '@/components/events/EventCard'
import type { Event } from '@/payload-types'

interface AttendedEventsListProps {
  events: Event[]
}

export function AttendedEventsList({ events }: AttendedEventsListProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-slate-300 dark:text-slate-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h3 className="mt-4 text-base font-medium text-slate-700 dark:text-slate-300">
          Aún no has asistido a ningún evento
        </h3>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-500">
          Cuando participes en un evento aparecerá aquí.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
