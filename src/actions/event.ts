'use server'

import pino from 'pino'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Event } from '@/payload-types'
import {
  EventRegistrationError,
  EventRegistrationResult,
  RegistrationStatusResult,
  NewMemberRegistrationResult,
} from '@/lib/types/event'
import { createMember, retrieveMember } from './member'
import type { Member } from '@/lib/types/member'

// Create a logger instance
const logger = pino()

/**
 * T005: Get event by ID
 * Fetches an event with populated relationships
 *
 * @param eventId - The event ID to fetch
 * @returns Event data or null if not found
 */
export async function getEventById(eventId: string): Promise<Event | null> {
  try {
    const payload = await getPayload({ config })

    const event = await payload.findByID({
      collection: 'events',
      id: eventId,
      depth: 2, // Populate speakers and other relationships
    })

    if (!event) {
      logger.warn(`Event not found: ${eventId}`)
      return null
    }

    logger.info(`Event retrieved: ${eventId}`)
    return event as Event
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error retrieving event ${eventId}: ${errorMessage}`)
    return null
  }
}

/**
 * T003: Check if user is registered for an event
 * Checks if a user (by nextAuthId) is already in the event's attendees relationship
 *
 * @param eventId - The event ID to check
 * @param nextAuthId - User's NextAuth ID to match against members
 * @returns Registration status with attendee data if registered
 */
export async function checkEventRegistration(
  eventId: string,
  nextAuthId: string,
): Promise<RegistrationStatusResult> {
  try {
    const payload = await getPayload({ config })
    console.log('🚀 ~ checkEventRegistration ~ payload:', payload)

    // First, find the member by nextAuthId
    const memberResult = await payload.find({
      collection: 'members',
      where: {
        nextAuthId: {
          equals: nextAuthId,
        },
      },
      limit: 1,
      select: {
        id: true,
        fullName: true,
        profileImage: true,
      },
    })

    if (!memberResult.docs || memberResult.docs.length === 0) {
      return { isRegistered: false }
    }

    const member = memberResult.docs[0]

    // Check if this member is in the event's attendees (optimized query - only fetch attendees)
    const eventResult = await payload.find({
      collection: 'events',
      where: {
        id: {
          equals: eventId,
        },
      },
      limit: 1,
      depth: 0, // Only get attendee IDs, no need to populate
      select: {
        attendees: true,
      },
    })

    const event = eventResult.docs[0]
    if (!event || !event.attendees || !Array.isArray(event.attendees)) {
      return { isRegistered: false }
    }

    // Check if member ID is in attendees (will be just numbers with depth: 0)
    const isAttendee = event.attendees.some((attendee) => {
      if (typeof attendee === 'number') {
        return attendee === Number(member.id)
      }
      if (typeof attendee === 'object' && attendee !== null && 'id' in attendee) {
        return attendee.id === Number(member.id)
      }
      return false
    })

    if (isAttendee) {
      logger.info(`User ${nextAuthId} is registered for event ${eventId}`)
      return {
        isRegistered: true,
        attendee: {
          name: member.fullName,
          avatarUrl: member.profileImage || undefined,
        },
      }
    }

    return { isRegistered: false }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error checking registration for event ${eventId}: ${errorMessage}`)
    return { isRegistered: false }
  }
}

/**
 * T003 Enhanced: Check registration by member ID
 * Checks if a specific member is registered for an event
 *
 * @param eventId - The event ID to check
 * @param memberId - The member's ID
 * @returns Registration status
 */
export async function checkMemberRegistration(
  eventId: string,
  memberId: string,
): Promise<RegistrationStatusResult> {
  try {
    const payload = await getPayload({ config })

    const event = await getEventById(eventId)

    if (!event || !event.attendees || !Array.isArray(event.attendees)) {
      return { isRegistered: false }
    }

    // Check if member ID is in attendees
    const isAttendee = event.attendees.some((attendee) => {
      if (typeof attendee === 'number') {
        return attendee === Number(memberId)
      }
      if (typeof attendee === 'object' && attendee !== null && 'id' in attendee) {
        return attendee.id === Number(memberId)
      }
      return false
    })

    if (isAttendee) {
      // Fetch member details for return data
      const member = await payload.findByID({
        collection: 'members',
        id: Number(memberId),
      })

      return {
        isRegistered: true,
        attendee: {
          name: member.fullName,
          avatarUrl: member.profileImage || undefined,
        },
      }
    }

    return { isRegistered: false }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error checking member registration: ${errorMessage}`)
    return { isRegistered: false }
  }
}

/**
 * T004: Register member to event
 * Adds a member to the event's attendees relationship with validation
 *
 * @param eventId - The event ID to register for
 * @param memberId - The member ID to register
 * @returns Registration result with success/error status
 */
export async function registerMemberToEvent(
  eventId: string,
  memberId: string,
): Promise<EventRegistrationResult> {
  try {
    const payload = await getPayload({ config })

    // Validate member exists
    const member = await payload.findByID({
      collection: 'members',
      id: Number(memberId),
    })

    if (!member) {
      logger.warn(`Member not found: ${memberId}`)
      return {
        success: false,
        error: EventRegistrationError.MEMBER_NOT_FOUND,
        message: 'No se encontró tu perfil de miembro.',
      }
    }

    // Fetch event
    const event = await getEventById(eventId)

    if (!event) {
      logger.warn(`Event not found for registration: ${eventId}`)
      return {
        success: false,
        error: EventRegistrationError.EVENT_NOT_FOUND,
        message: 'El evento no fue encontrado.',
      }
    }

    // Check if event is published
    if (!event.isPublished) {
      logger.warn(`Event not published: ${eventId}`)
      return {
        success: false,
        error: EventRegistrationError.EVENT_NOT_PUBLISHED,
        message: 'Este evento no está disponible para registro.',
      }
    }

    // Check if event is in the future
    const eventDate = new Date(event.startDate)
    const now = new Date()
    if (eventDate < now) {
      logger.warn(`Event already passed: ${eventId}`)
      return {
        success: false,
        error: EventRegistrationError.EVENT_ALREADY_PASSED,
        message: 'Este evento ya finalizó.',
      }
    }

    // Check capacity if maxAttendees is set
    if (event.maxAttendees && event.maxAttendees > 0) {
      const currentAttendees = event.attendees?.length || 0
      if (currentAttendees >= event.maxAttendees) {
        logger.warn(`Event at capacity: ${eventId}`)
        return {
          success: false,
          error: EventRegistrationError.EVENT_FULL,
          message: 'El evento ha alcanzado su capacidad máxima.',
        }
      }
    }

    // Check for duplicate registration
    const registrationCheck = await checkMemberRegistration(eventId, memberId)
    if (registrationCheck.isRegistered) {
      logger.info(`Member already registered: ${memberId} for event ${eventId}`)
      return {
        success: false,
        error: EventRegistrationError.ALREADY_REGISTERED,
        message: 'Ya estás registrado para este evento.',
      }
    }

    // Add member to event's attendees relationship
    const currentAttendees = Array.isArray(event.attendees) ? event.attendees : []
    const attendeeIds = currentAttendees.map((a) =>
      typeof a === 'number' ? a : typeof a === 'object' && a !== null ? a.id : null,
    )
    const updatedAttendeeIds = [...attendeeIds.filter((id) => id !== null), Number(memberId)]

    await payload.update({
      collection: 'events',
      id: eventId,
      data: {
        attendees: updatedAttendeeIds,
      },
    })

    logger.info(`Member registered successfully: ${memberId} to event ${eventId}`)

    return {
      success: true,
      message: '¡Registro exitoso! Te esperamos en el evento.',
      attendee: {
        name: member.fullName,
        avatarUrl: member.profileImage || undefined,
      },
      eventId,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error registering member to event ${eventId}: ${errorMessage}`)

    return {
      success: false,
      error: EventRegistrationError.DATABASE_ERROR,
      message: 'Error al procesar tu registro. Por favor, intenta nuevamente.',
    }
  }
}

/**
 * T014: Register new member and add to event (orchestration)
 * Creates a new member and registers them to an event atomically
 *
 * @param memberData - Member data for registration
 * @param eventId - Event ID to register for
 * @returns Combined result with both operation statuses
 */
export async function registerNewMemberToEvent(
  memberData: Member,
  eventId: string,
): Promise<NewMemberRegistrationResult> {
  try {
    // Step 1: Create member
    logger.info(`Starting new member registration for event ${eventId}`)
    const member = await createMember(memberData)

    if (!member) {
      logger.error('Failed to create member')
      return {
        success: false,
        memberCreated: false,
        eventRegistered: false,
        message: 'Error al crear tu perfil de miembro.',
        error: EventRegistrationError.DATABASE_ERROR,
      }
    }

    logger.info(`Member created: ${member.id}`)

    // Step 2: Register to event using member ID
    const registrationResult = await registerMemberToEvent(eventId, String(member.id))

    if (!registrationResult.success) {
      logger.warn('Member created but event registration failed')
      return {
        success: false,
        memberCreated: true,
        eventRegistered: false,
        memberId: member.id,
        message:
          'Registro de miembro exitoso, pero hubo un error al registrarte en el evento. Por favor, intenta asistir al evento nuevamente.',
        error: registrationResult.error,
      }
    }

    logger.info(`Member registered to event successfully: ${member.id} to ${eventId}`)

    return {
      success: true,
      memberCreated: true,
      eventRegistered: true,
      memberId: member.id,
      message:
        '¡Registro exitoso! Gracias por unirte a nuestra comunidad. Te esperamos en el evento.',
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error in registerNewMemberToEvent: ${errorMessage}`)

    return {
      success: false,
      memberCreated: false,
      eventRegistered: false,
      message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
      error: EventRegistrationError.UNKNOWN_ERROR,
    }
  }
}

/**
 * T020: Register existing member to event
 * Looks up member by nextAuthId and registers them to an event
 *
 * @param eventId - Event ID to register for
 * @param nextAuthId - User's NextAuth ID
 * @returns Registration result
 */
export async function registerExistingMemberToEvent(
  eventId: string,
  nextAuthId: string,
): Promise<EventRegistrationResult> {
  try {
    // Step 1: Retrieve member
    const member = await retrieveMember(nextAuthId)

    if (!member) {
      logger.warn(`Member not found for nextAuthId: ${nextAuthId}`)
      return {
        success: false,
        error: EventRegistrationError.MEMBER_NOT_FOUND,
        message: 'No se encontró tu perfil de miembro.',
      }
    }

    // Step 2: Register to event using member ID
    return await registerMemberToEvent(eventId, String(member.id))
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error in registerExistingMemberToEvent: ${errorMessage}`)

    return {
      success: false,
      error: EventRegistrationError.UNKNOWN_ERROR,
      message: 'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
    }
  }
}
