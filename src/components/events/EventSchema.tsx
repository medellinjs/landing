import type { Event, Media, Speaker } from '@/payload-types'

interface EventSchemaProps {
  event: Event
}

/**
 * Generate JSON-LD structured data for Event schema
 * https://schema.org/Event
 */
export function EventSchema({ event }: EventSchemaProps) {
  const previewImage = event.previewImage as Media | undefined
  const speakers = (event.speakers as Speaker[]) || []

  const startDate = new Date(event.startDate)
  const endDate = new Date(event.endDate || event.startDate)

  // Extract description from Lexical content
  let description = 'Evento de la comunidad MedellinJS'
  if (typeof event.description === 'object' && event.description?.root) {
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || ''
      if (node.children) return node.children.map(extractText).join('')
      return ''
    }
    const fullText = event.description.root.children.map(extractText).join(' ')
    description = fullText.slice(0, 200)
  }

  // Build location object
  const location: any = {
    '@type': 'Place',
    name: typeof event.venue === 'object' && event.venue?.name ? event.venue.name : 'Por confirmar',
  }

  if (typeof event.venue === 'object' && event.venue?.googleMapsUrl) {
    location.url = event.venue.googleMapsUrl
  }

  // Build performer array (speakers)
  const performers = speakers.map((speaker) => ({
    '@type': 'Person',
    name: speaker.name,
    jobTitle: speaker.role,
    worksFor: speaker.company
      ? {
          '@type': 'Organization',
          name: speaker.company,
        }
      : undefined,
    url: speaker.link || undefined,
  }))

  // Build the Event schema
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: event.title,
    description,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    // We don't currently store "cancelled/postponed/rescheduled" in Payload,
    // so we default to Scheduled (even for past events).
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location,
    image: previewImage?.url || undefined,
    organizer: {
      '@type': 'Organization',
      name: 'MedellinJS',
      url: 'https://medellinjs.org',
    },
    performer: performers.length > 0 ? performers : undefined,
    // If you later add a registration URL field, we can emit schema.org/Offer here.
    // Offers are optional, so we omit them for now.
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
