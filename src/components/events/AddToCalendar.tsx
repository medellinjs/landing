'use client'

import { useEffect, useMemo, useState, type FC } from 'react'
import { CalendarPlus, Download } from 'lucide-react'
import {
  buildGoogleCalendarUrl,
  buildIcsContent,
  buildIcsFilename,
  type CalendarEventInput,
} from '@/lib/calendar'

export interface AddToCalendarProps {
  eventId: string
  eventTitle: string
  startDate: string
  endDate?: string | null
  venueName?: string | null
  venueUrl?: string | null
  eventSlug?: string
  descriptionExcerpt?: string
}

/**
 * Renders two subordinate controls that let a user add an event to their
 * calendar: a Google Calendar link and an .ics file download.
 *
 * Deliberately receives a minimal, explicit prop set (never the whole Event
 * object) — this is a structural defense against accidentally reaching
 * event.timezone, which is never used for calendar math.
 */
const AddToCalendar: FC<AddToCalendarProps> = ({
  eventId,
  eventTitle,
  startDate,
  endDate,
  venueName,
  venueUrl,
  eventSlug,
  descriptionExcerpt,
}) => {
  const [origin, setOrigin] = useState<string | null>(null)

  useEffect(() => {
    setOrigin(window.location.origin)
  }, [])

  const calendarInput: CalendarEventInput | null = useMemo(() => {
    if (!origin) return null
    return {
      eventId,
      title: eventTitle,
      startDate,
      endDate,
      venueName,
      venueUrl,
      slug: eventSlug,
      origin,
      descriptionExcerpt,
    }
  }, [
    origin,
    eventId,
    eventTitle,
    startDate,
    endDate,
    venueName,
    venueUrl,
    eventSlug,
    descriptionExcerpt,
  ])

  const googleCalendarUrl = useMemo(() => {
    if (!calendarInput) return null
    return buildGoogleCalendarUrl(calendarInput)
  }, [calendarInput])

  const handleDownloadIcs = () => {
    if (!calendarInput) return

    const ics = buildIcsContent(calendarInput)
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    try {
      const link = document.createElement('a')
      link.href = url
      link.download = buildIcsFilename(calendarInput)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } finally {
      URL.revokeObjectURL(url)
    }
  }

  if (!calendarInput || !googleCalendarUrl) {
    return null
  }

  return (
    <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
      <a
        href={googleCalendarUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Agregar evento a Google Calendar"
        className="inline-flex items-center gap-1 text-white/80 underline underline-offset-2 hover:text-white"
      >
        <CalendarPlus className="size-4" />
        Google Calendar
      </a>

      <button
        type="button"
        onClick={handleDownloadIcs}
        aria-label="Descargar evento como archivo .ics"
        className="inline-flex items-center gap-1 text-white/80 underline underline-offset-2 hover:text-white"
      >
        <Download className="size-4" />
        Descargar .ics
      </button>
    </div>
  )
}

export default AddToCalendar
