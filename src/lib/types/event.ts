/**
 * Event Registration Types
 *
 * Type definitions for the event attendee registration feature.
 * These types are used across server actions, components, and hooks.
 */

/**
 * Attendee input data for event registration
 * Matches the structure in Events.attendees collection field
 */
export interface AttendeeInput {
  name: string
  avatarUrl?: string
}

/**
 * Registration error codes for better error handling
 */
export enum EventRegistrationError {
  EVENT_NOT_FOUND = 'EVENT_NOT_FOUND',
  EVENT_NOT_PUBLISHED = 'EVENT_NOT_PUBLISHED',
  EVENT_ALREADY_PASSED = 'EVENT_ALREADY_PASSED',
  EVENT_FULL = 'EVENT_FULL',
  ALREADY_REGISTERED = 'ALREADY_REGISTERED',
  MEMBER_NOT_FOUND = 'MEMBER_NOT_FOUND',
  INVALID_DATA = 'INVALID_DATA',
  DATABASE_ERROR = 'DATABASE_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/**
 * Success result for event registration
 */
export interface EventRegistrationSuccess {
  success: true
  message: string
  attendee: AttendeeInput
  eventId: string
}

/**
 * Error result for event registration
 */
export interface EventRegistrationErrorResult {
  success: false
  error: EventRegistrationError
  message: string
}

/**
 * Union type for event registration result
 */
export type EventRegistrationResult = EventRegistrationSuccess | EventRegistrationErrorResult

/**
 * Registration status check result
 */
export interface RegistrationStatusResult {
  isRegistered: boolean
  attendee?: AttendeeInput
}

/**
 * Combined operation result for new member registration + event registration
 */
export interface NewMemberRegistrationResult {
  success: boolean
  memberCreated: boolean
  eventRegistered: boolean
  memberId?: string | number
  message: string
  error?: EventRegistrationError
}

/**
 * Type guard to check if result is success
 */
export function isRegistrationSuccess(
  result: EventRegistrationResult,
): result is EventRegistrationSuccess {
  return result.success === true
}

/**
 * Type guard to check if result is error
 */
export function isRegistrationError(
  result: EventRegistrationResult,
): result is EventRegistrationErrorResult {
  return result.success === false
}

/**
 * Error messages mapping for user-friendly display
 */
export const ERROR_MESSAGES: Record<EventRegistrationError, string> = {
  [EventRegistrationError.EVENT_NOT_FOUND]: 'El evento no fue encontrado.',
  [EventRegistrationError.EVENT_NOT_PUBLISHED]: 'Este evento no está disponible para registro.',
  [EventRegistrationError.EVENT_ALREADY_PASSED]: 'Este evento ya finalizó.',
  [EventRegistrationError.EVENT_FULL]: 'El evento ha alcanzado su capacidad máxima.',
  [EventRegistrationError.ALREADY_REGISTERED]: 'Ya estás registrado para este evento.',
  [EventRegistrationError.MEMBER_NOT_FOUND]: 'No se encontró tu perfil de miembro.',
  [EventRegistrationError.INVALID_DATA]: 'Los datos proporcionados son inválidos.',
  [EventRegistrationError.DATABASE_ERROR]:
    'Error al procesar tu registro. Por favor, intenta nuevamente.',
  [EventRegistrationError.UNKNOWN_ERROR]:
    'Ocurrió un error inesperado. Por favor, intenta nuevamente.',
}
