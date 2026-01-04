'use client'

import { useState, useCallback, useEffect } from 'react'
import { useSession } from 'next-auth/react'

import { checkMemberRegistration, registerExistingMemberToEvent } from '@/actions/event'
import { retrieveMember } from '@/actions/member'
import type { EventRegistrationResult } from '@/lib/types/event'

/**
 * Registration flow states
 */
export type RegistrationState =
  | 'idle' // Initial state
  | 'checking' // Checking if user is registered
  | 'not_registered' // User not registered, can proceed
  | 'needs_member_form' // User needs to complete member registration
  | 'registering' // Registration in progress
  | 'registered' // Successfully registered
  | 'error' // Error occurred

export interface UseEventRegistrationResult {
  /** Current registration state */
  state: RegistrationState
  /** Whether user is registered for the event */
  isRegistered: boolean
  /** Whether user needs to fill member form */
  needsMemberForm: boolean
  /** Error message if any */
  error: string | null
  /** Registration result from server */
  registrationResult: EventRegistrationResult | null
  /** Check if user is already registered */
  checkRegistration: () => Promise<void>
  /** Register existing member to event */
  registerExistingMember: () => Promise<EventRegistrationResult | null>
  /** Mark as registered (called after form submission) */
  markAsRegistered: (result: EventRegistrationResult) => void
  /** Reset state */
  reset: () => void
}

/**
 * Hook for managing event registration flow and state
 *
 * @param eventId - The event ID to register for
 * @returns Registration state and control functions
 */
export function useEventRegistration(eventId: string): UseEventRegistrationResult {
  const { data: session, status: sessionStatus } = useSession()
  const [state, setState] = useState<RegistrationState>('idle')
  const [error, setError] = useState<string | null>(null)
  const [registrationResult, setRegistrationResult] = useState<EventRegistrationResult | null>(null)
  const [isRegistered, setIsRegistered] = useState(false)
  const [needsMemberForm, setNeedsMemberForm] = useState(false)

  /**
   * Check if user is already registered for the event
   */
  const checkRegistration = useCallback(async () => {
    if (!session?.user || !eventId) return

    setState('checking')
    setError(null)

    try {
      // First, check if user is a member
      const member = await retrieveMember(session.user.id)

      if (!member) {
        // User is not a member, needs to complete registration form
        setState('needs_member_form')
        setNeedsMemberForm(true)
        setIsRegistered(false)
        return
      }

      // User is a member, check if already registered for event
      const registrationStatus = await checkMemberRegistration(
        eventId,
        member.fullName,
        member.email,
      )

      if (registrationStatus.isRegistered) {
        setState('registered')
        setIsRegistered(true)
        setNeedsMemberForm(false)
      } else {
        setState('not_registered')
        setIsRegistered(false)
        setNeedsMemberForm(false)
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al verificar registro'
      setError(errorMessage)
      setState('error')
    }
  }, [session, eventId])

  /**
   * Register existing member to event
   */
  const registerExistingMember = useCallback(async (): Promise<EventRegistrationResult | null> => {
    if (!session?.user?.id || !eventId) {
      setError('Sesión no válida')
      return null
    }

    setState('registering')
    setError(null)

    try {
      const result = await registerExistingMemberToEvent(eventId, session.user.id)

      if (result.success) {
        setState('registered')
        setIsRegistered(true)
        setRegistrationResult(result)
      } else {
        setState('error')
        setError(result.message)
        setRegistrationResult(result)
      }

      return result
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al registrar'
      setError(errorMessage)
      setState('error')
      return null
    }
  }, [session, eventId])

  /**
   * Mark as registered (after completing member form + event registration)
   */
  const markAsRegistered = useCallback((result: EventRegistrationResult) => {
    setRegistrationResult(result)
    if (result.success) {
      setState('registered')
      setIsRegistered(true)
      setNeedsMemberForm(false)
    } else {
      setState('error')
      setError(result.message)
    }
  }, [])

  /**
   * Reset state
   */
  const reset = useCallback(() => {
    setState('idle')
    setError(null)
    setRegistrationResult(null)
    setIsRegistered(false)
    setNeedsMemberForm(false)
  }, [])

  // Auto-check registration when session becomes available
  useEffect(() => {
    if (sessionStatus === 'authenticated' && session?.user && state === 'idle') {
      checkRegistration()
    }
  }, [sessionStatus, session, state, checkRegistration])

  return {
    state,
    isRegistered,
    needsMemberForm,
    error,
    registrationResult,
    checkRegistration,
    registerExistingMember,
    markAsRegistered,
    reset,
  }
}
