import Image from 'next/image'
import { Calendar, Clock, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import type { Event, Media, Speaker } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import { SpeakerList } from './SpeakerList'
import { AttendeeList } from './AttendeeList'
import AttendButton from '../auth/AttendButton'
import styles from './RichTextContent.module.css'

interface EventDetailProps {
  event: Event
}

function formatDateOnly(dateString: string, timezone: string = 'America/Bogota'): string {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-CO', {
    dateStyle: 'full',
    timeZone: timezone,
  }).format(date)
}

function formatTimeRange(
  startDate: string,
  endDate: string | null | undefined,
  timezone: string = 'America/Bogota',
): string {
  const start = new Date(startDate)
  const startTime = new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'short',
    timeZone: timezone,
  }).format(start)

  if (!endDate) return startTime

  const end = new Date(endDate)
  const endTime = new Intl.DateTimeFormat('es-CO', {
    timeStyle: 'short',
    timeZone: timezone,
  }).format(end)

  return `${startTime} - ${endTime}`
}

export function EventDetail({ event }: EventDetailProps) {
  const previewImage = event.previewImage as Media | undefined
  const imageUrl = previewImage?.url
  const speakers = (event.speakers as Speaker[]) || []
  const attendees = event.attendees || []

  // Check if event is in the future
  const isUpcomingEvent = new Date(event.startDate) > new Date()

  return (
    <>
      {/* Draft Banner for unpublished events */}
      {!event.isPublished && (
        <div className="fixed left-0 right-0 top-0 z-50 bg-orange-500 px-4 py-2 text-center text-sm font-medium text-white">
          ⚠️ Este evento está en modo borrador y solo es visible para administradores y
          organizadores
        </div>
      )}

      <section
        className={`relative table w-full ${!event.isPublished ? 'pt-28 lg:pt-36' : 'pt-20 lg:pt-28'}`}
      >
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 text-center">
            <h1 className="mb-5 text-4xl font-bold leading-normal lg:text-5xl lg:leading-normal">
              {event.title}
            </h1>
          </div>
        </div>
      </section>

      <section className="relative py-16 pt-0 md:py-24 md:pt-0">
        <div className="container relative">
          <div className="grid grid-cols-1 justify-center">
            <div className="relative z-1">
              <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
                <div className="lg:col-span-10 lg:col-start-2">
                  <div className="relative">
                    <Image
                      src={imageUrl || ''}
                      width={0}
                      height={0}
                      sizes="100vw"
                      style={{ width: '100%', height: 'auto' }}
                      className="rounded-md shadow-lg"
                      priority
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
                            {formatDateOnly(event.startDate, event.timezone)}
                          </span>
                        </div>
                        <div className="mb-2 flex items-center">
                          <Clock className="mr-2 text-white" />
                          <span className="font-semibold leading-normal text-white">
                            {formatTimeRange(event.startDate, event.endDate, event.timezone)}
                          </span>
                        </div>

                        {typeof event.venue === 'object' && event.venue?.name && (
                          <div className="mb-2 flex justify-between">
                            <MapPin className="mr-2 text-white" />
                            <a
                              href={event.venue.googleMapsUrl || undefined}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-1 block text-sm text-white underline hover:text-violet-600"
                            >
                              <p className="font-semibold leading-normal text-white">
                                {event.venue.name}
                              </p>
                              {event.venue.extraInfo && (
                                <p className="mt-2 text-sm text-white">{event.venue.extraInfo}</p>
                              )}
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      {event.tags && event.tags.length > 0 && (
                        <div className="mb-8">
                          <div className="flex flex-wrap gap-2">
                            {event.tags.map((tagItem, index) => (
                              <span
                                key={index}
                                className="rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800"
                              >
                                {typeof tagItem === 'object' && tagItem.tag ? tagItem.tag : ''}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Only show attend button for upcoming events */}
                      {isUpcomingEvent && (
                        <AttendButton
                          eventId={String(event.id)}
                          eventSlug={typeof event.slug === 'string' ? event.slug : undefined}
                          eventTitle={event.title}
                          eventDate={format(new Date(event.startDate), 'EEE, MMM d', {
                            locale: es,
                          })}
                          eventTime={`${format(new Date(event.startDate), 'h:mm a')} COT`}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 end-0 start-0 h-4/5 bg-gradient-to-b from-indigo-500 to-indigo-600 sm:h-2/3"></div>
      </section>

      <section className="relative pt-16" id="event">
        <div className="container relative mb-16 md:mb-24">
          <div className="grid grid-cols-1 pb-8 text-center">
            <h6 className="mb-2 text-sm font-bold uppercase text-indigo-600">{event.eventType}</h6>
            <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              {event.title}
            </h3>

            <div className={`mx-auto mb-4 text-left text-slate-400 ${styles.richTextContent}`}>
              <RichText data={event.description as SerializedEditorState} />
            </div>
          </div>
        </div>

        <SpeakerList speakers={speakers} />
      </section>

      <AttendeeList
        attendees={attendees.map((a) => ({
          name: a.name || '',
          avatarUrl: a.avatarUrl || undefined,
          id: a.id || undefined,
        }))}
      />
    </>
  )
}
