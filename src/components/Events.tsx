import Link from 'next/link'
import Image from 'next/image'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { getLatestEvent } from '@/lib/payload/queries'
import type { Media } from '@/payload-types'

export default async function Events() {
  // Fetch the latest published event
  const event = await getLatestEvent()

  // If no event exists, show a placeholder
  if (!event) {
    return (
      <section className="relative bg-white py-16 pt-0 md:py-24 md:pt-0">
        <div className="container relative">
          <div className="text-center">
            <h2 className="text-2xl font-semibold">No hay eventos disponibles</h2>
            <p className="mt-2 text-gray-600">Pronto anunciaremos nuevos eventos</p>
          </div>
        </div>
        <div className="absolute bottom-0 end-0 start-0 h-4/5 bg-gradient-to-b from-indigo-500 to-indigo-600 sm:h-2/3"></div>
      </section>
    )
  }

  // Format date and time
  const eventDate = new Date(event.startDate)
  const formattedDate = eventDate.toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const formattedTime = event.endDate
    ? `${eventDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })} - ${new Date(event.endDate).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}`
    : eventDate.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })

  // Get venue name
  const venueName = event.venue?.name || 'Por definir'

  // Get preview image
  const previewImage = event.previewImage as Media | undefined
  const imageUrl = previewImage?.url || '/event-1.webp'

  // Extract description text from Lexical content
  let descriptionText = 'Evento de la comunidad MedellinJS'
  if (typeof event.description === 'object' && event.description?.root) {
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || ''
      if (node.children) return node.children.map(extractText).join('')
      return ''
    }
    const fullText = event.description.root.children.map(extractText).join(' ')
    descriptionText = fullText.slice(0, 200) + (fullText.length > 200 ? '...' : '')
  }

  // Get event type label
  const eventTypeLabels: Record<string, string> = {
    charla: 'Charla',
    taller: 'Taller',
    panel: 'Panel de Discusión',
    hackathon: 'Hackathon',
    networking: 'Networking',
    'lightning-talks': 'Lightning Talks',
  }
  const eventTypeLabel = eventTypeLabels[event.eventType || 'charla'] || 'Evento'

  return (
    <section className="relative bg-white py-16 pt-0 md:py-24 md:pt-0">
      <div className="container relative">
        <div className="grid grid-cols-1 justify-center">
          <div className="relative z-1">
            <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
              <div className="lg:col-span-10 lg:col-start-2">
                <div className="relative">
                  <Image
                    src={imageUrl}
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="rounded-md shadow-lg"
                    alt={event.title}
                  />
                </div>
              </div>
            </div>
            <div className="content md:mt-8">
              <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
                <div className="lg:col-span-10 lg:col-start-2">
                  <div className="justify-center text-center">
                    <div className="flex justify-between">
                      <div className="mb-2 flex items-center">
                        <Calendar className="mr-2 text-white" />
                        <span className="font-semibold leading-normal text-white">
                          {formattedDate}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center">
                        <Clock className="mr-2 text-white" />
                        <span className="font-semibold leading-normal text-white">
                          {formattedTime}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center">
                        <MapPin className="mr-2 text-white" />
                        <span className="font-semibold leading-normal text-white">{venueName}</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-center md:grid-cols-2">
                    <div className="mt-8">
                      <div className="section-title text-md-start">
                        <h6 className="text-lg font-semibold text-white/50">{eventTypeLabel}</h6>
                        <h3 className="mt-2 text-2xl font-semibold leading-normal text-white md:text-3xl md:leading-normal">
                          {event.title}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="section-title text-md-start">
                        <p className="mx-auto mb-2 max-w-xl text-white/50">{descriptionText}</p>
                        <Link
                          href={`/events/${event.slug}`}
                          className="flex text-white hover:underline"
                        >
                          Más información{' '}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 end-0 start-0 h-4/5 bg-gradient-to-b from-indigo-500 to-indigo-600 sm:h-2/3"></div>
    </section>
  )
}
