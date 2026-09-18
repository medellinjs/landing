import { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { getEventBySlug, getPublishedEvents } from '@/lib/payload/queries'
import { EventDetail } from '@/components/events/EventDetail'
import { EventSchema } from '@/components/events/EventSchema'
import { extractPlainText } from '@/lib/richText'
import type { Media } from '@/payload-types'
import Footer from '@/components/Footer'
import { Navbar } from '@/components/Navbar'
import Newsletter from '@/components/Newsletter'

interface EventPageProps {
  params: Promise<{
    slug: string
  }>
}

// Generate static params for past events (ISR for future events)
export async function generateStaticParams() {
  const { docs: events } = await getPublishedEvents({ limit: 100 })

  // Only generate static pages for past/completed events
  const pastEvents = events.filter((event) => {
    const eventDate = new Date(event.startDate)
    return eventDate < new Date()
  })

  return pastEvents.map((event) => ({
    slug: event.slug,
  }))
}

// Generate metadata for SEO
export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  if (!event) {
    return {
      title: 'Evento no encontrado | MedellinJS',
    }
  }

  // Extract description from Lexical content
  const extractedDescription = extractPlainText(event.description, 160)
  const description = extractedDescription || 'Evento de la comunidad MedellinJS'

  const previewImage = event.previewImage as Media | undefined
  const imageUrl = previewImage?.url

  return {
    title: `${event.title} | MedellinJS`,
    description,
    openGraph: {
      title: event.title,
      description,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

// Revalidate every 60 seconds (ISR)
export const revalidate = 60

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params
  const event = await getEventBySlug(slug)

  // getEventBySlug already handles access control
  // Returns null if event is unpublished and user is not admin/organizer
  if (!event) {
    notFound()
  }

  return (
    <>
      <Navbar />
      <EventSchema event={event} />
      <EventDetail event={event} />

      <Newsletter />

      <Footer />
    </>
  )
}
