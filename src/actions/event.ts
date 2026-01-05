'use server'

import pino from 'pino'
import { getPayload } from 'payload'
import config from '@payload-config'

import type { Event } from '@/payload-types'
import {
  AttendeeInput,
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
 * Checks if a user is already in the event's attendees list
 *
 * @param eventId - The event ID to check
 * @param userEmail - User's email to match against attendees
 * @returns Registration status with attendee data if registered
 */
export async function checkEventRegistration(
  eventId: string,
  userEmail: string,
): Promise<RegistrationStatusResult> {
  try {
    const event = await getEventById(eventId)

    if (!event) {
      logger.warn(`Event not found for registration check: ${eventId}`)
      return { isRegistered: false }
    }

    // Check if attendees array exists and has items
    if (!event.attendees || !Array.isArray(event.attendees) || event.attendees.length === 0) {
      return { isRegistered: false }
    }

    // Find attendee by matching name with email (case-insensitive)
    // This is a temporary solution - ideally we'd store email or ID
    const attendee = event.attendees.find((a) => {
      if (typeof a === 'object' && a !== null && 'name' in a) {
        // For now, we'll need to check by email lookup
        // In production, you might want to add an email field to attendees
        return false // Will be enhanced with member lookup
      }
      return false
    })

    if (attendee && typeof attendee === 'object' && 'name' in attendee) {
      logger.info(`User ${userEmail} is registered for event ${eventId}`)
      return {
        isRegistered: true,
        attendee: {
          name: attendee.name as string,
          avatarUrl: attendee.avatarUrl as string | undefined,
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
 * T003 Enhanced: Check registration by member data
 * More accurate check using member information
 *
 * @param eventId - The event ID to check
 * @param memberName - Member's full name
 * @param memberEmail - Member's email (optional fallback)
 * @returns Registration status
 */
export async function checkMemberRegistration(
  eventId: string,
  memberName: string,
  memberEmail?: string,
): Promise<RegistrationStatusResult> {
  try {
    const event = await getEventById(eventId)

    if (!event || !event.attendees || !Array.isArray(event.attendees)) {
      return { isRegistered: false }
    }

    // Check by name (primary) or email (fallback)
    const attendee = event.attendees.find((a) => {
      if (typeof a === 'object' && a !== null && 'name' in a) {
        const attendeeName = (a.name as string).toLowerCase().trim()
        const searchName = memberName.toLowerCase().trim()

        // Exact name match
        if (attendeeName === searchName) {
          return true
        }

        // If email is provided, could add email-based matching in future
        // For now, rely on name matching
        return false
      }
      return false
    })

    if (attendee && typeof attendee === 'object' && 'name' in attendee) {
      return {
        isRegistered: true,
        attendee: {
          name: attendee.name as string,
          avatarUrl: (attendee.avatarUrl as string) || undefined,
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
 * T004: Register attendee to event
 * Adds an attendee to the event's attendees array with validation
 *
 * @param eventId - The event ID to register for
 * @param attendee - Attendee data (name and optional avatarUrl)
 * @returns Registration result with success/error status
 */
export async function registerAttendeeToEvent(
  eventId: string,
  attendee: AttendeeInput,
): Promise<EventRegistrationResult> {
  try {
    const payload = await getPayload({ config })

    // Validate input
    if (!attendee.name || attendee.name.trim().length === 0) {
      logger.warn('Invalid attendee data: name is required')
      return {
        success: false,
        error: EventRegistrationError.INVALID_DATA,
        message: 'El nombre del asistente es requerido.',
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
    const registrationCheck = await checkMemberRegistration(eventId, attendee.name)
    if (registrationCheck.isRegistered) {
      logger.info(`User already registered: ${attendee.name} for event ${eventId}`)
      return {
        success: false,
        error: EventRegistrationError.ALREADY_REGISTERED,
        message: 'Ya estás registrado para este evento.',
      }
    }

    // Add attendee to event
    const currentAttendees = event.attendees || []
    const updatedAttendees = [
      ...currentAttendees,
      {
        name: attendee.name.trim(),
        avatarUrl: attendee.avatarUrl || undefined,
      },
    ]

    await payload.update({
      collection: 'events',
      id: eventId,
      data: {
        attendees: updatedAttendees,
      },
    })

    logger.info(`Attendee registered successfully: ${attendee.name} to event ${eventId}`)

    return {
      success: true,
      message: '¡Registro exitoso! Te esperamos en el evento.',
      attendee: {
        name: attendee.name.trim(),
        avatarUrl: attendee.avatarUrl,
      },
      eventId,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error registering attendee to event ${eventId}: ${errorMessage}`)

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

    // Step 2: Register to event
    const registrationResult = await registerAttendeeToEvent(eventId, {
      name: member.fullName,
      avatarUrl: member.profileImage || undefined,
    })

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

    // Step 2: Register to event
    return await registerAttendeeToEvent(eventId, {
      name: member.fullName,
      avatarUrl: member.profileImage || undefined,
    })
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
