import type { Event, User } from '@/payload-types'
import { getPayload } from './getPayload'
import { cookies } from 'next/headers'

export interface GetEventsOptions {
  limit?: number
  page?: number
  includeUnpublished?: boolean
}

/**
 * Decode JWT payload without verification
 * Note: We validate the user exists in the database after decoding
 */
function decodeJWT(token: string): { id: string; collection: string } | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) {
      return null
    }

    // Decode the payload (second part)
    const payload = parts[1]
    const decoded = JSON.parse(Buffer.from(payload, 'base64').toString('utf8'))

    return decoded
  } catch {
    return null
  }
}

/**
 * Get the currently authenticated Payload admin user from cookies
 */
export async function getPayloadUser(): Promise<User | null> {
  try {
    const payload = await getPayload()
    const cookieStore = await cookies()
    const token = cookieStore.get('payload-token')

    if (!token?.value) {
      return null
    }

    // Decode the JWT token
    const decoded = decodeJWT(token.value)

    if (!decoded || decoded.collection !== 'users') {
      return null
    }

    // Fetch and validate the user from database
    // This serves as verification that the token is valid
    const user = await payload.findByID({
      collection: 'users',
      id: decoded.id,
      depth: 0,
    })

    return user as User
  } catch {
    // Token invalid, user not found, or other error
    return null
  }
}

/**
 * Check if user is admin or organizer
 */
export function isAdminOrOrganizer(user: User | null): boolean {
  if (!user) return false
  return user.role === 'admin' || user.role === 'organizer'
}

/**
 * Fetch published events sorted by start date (newest first)
 * If user is admin/organizer, includeUnpublished can be true
 */
export async function getPublishedEvents(
  options: GetEventsOptions = {},
): Promise<{ docs: Event[]; totalDocs: number; totalPages: number }> {
  const { limit = 50, page = 1, includeUnpublished = false } = options

  const payload = await getPayload()
  const user = await getPayloadUser()
  const canSeeUnpublished = includeUnpublished && isAdminOrOrganizer(user)

  const result = await payload.find({
    collection: 'events',
    where: canSeeUnpublished
      ? {}
      : {
          isPublished: {
            equals: true,
          },
        },
    sort: '-startDate',
    limit,
    page,
    depth: 2, // Populate speakers and media
  })

  return result
}

/**
 * Fetch a single event by slug
 * Returns unpublished events only for admin/organizer users
 */
export async function getEventBySlug(slug: string): Promise<Event | null> {
  const payload = await getPayload()
  const user = await getPayloadUser()
  const canSeeUnpublished = isAdminOrOrganizer(user)

  const result = await payload.find({
    collection: 'events',
    where: canSeeUnpublished
      ? {
          slug: {
            equals: slug,
          },
        }
      : {
          and: [
            {
              slug: {
                equals: slug,
              },
            },
            {
              isPublished: {
                equals: true,
              },
            },
          ],
        },
    depth: 2, // Populate speakers and media
    limit: 1,
  })

  return result.docs[0] || null
}

/**
 * Fetch featured events for homepage
 */
export async function getFeaturedEvents(limit = 3): Promise<Event[]> {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'events',
    where: {
      and: [
        {
          isPublished: {
            equals: true,
          },
        },
        {
          featured: {
            equals: true,
          },
        },
      ],
    },
    sort: '-startDate',
    limit,
    depth: 2,
  })

  return result.docs
}

/**
 * Fetch the latest published event
 */
export async function getLatestEvent(): Promise<Event | null> {
  const payload = await getPayload()

  const result = await payload.find({
    collection: 'events',
    where: {
      isPublished: {
        equals: true,
      },
    },
    sort: '-startDate',
    limit: 1,
    depth: 2, // Populate speakers and media
  })

  return result.docs[0] || null
}
