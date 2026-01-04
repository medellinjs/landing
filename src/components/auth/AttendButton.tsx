'use client'

import { useState, useEffect, useRef, FC } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FaLinkedin, FaCalendar, FaClock, FaCheckCircle } from 'react-icons/fa'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { EventRegistrationModal } from '@/components/events/EventRegistrationModal'
import { useEventRegistration } from '@/hooks/useEventRegistration'
import type { EventRegistrationResult } from '@/lib/types/event'

export type AttendButtonProps = {
  title?: string
  eventTitle?: string
  eventDate?: string
  eventTime?: string
  eventId: string
  eventSlug?: string
}

export const AttendButton: FC<AttendButtonProps> = ({
  title = 'Asistir al evento',
  eventTitle = 'este evento',
  eventDate,
  eventTime,
  eventId,
  eventSlug: _eventSlug,
}) => {
  const router = useRouter()
  const { data: session, status: sessionStatus } = useSession()
  const [connecting, setConnecting] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showFloating, setShowFloating] = useState(false)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)
  const [hasProcessedAuth, setHasProcessedAuth] = useState(false)
  const buttonRef = useRef<HTMLDivElement>(null)

  // Use registration hook for state management
  const {
    state: registrationState,
    isRegistered,
    needsMemberForm,
    error: _registrationError,
    registerExistingMember,
    markAsRegistered,
    checkRegistration: _checkRegistration,
  } = useEventRegistration(eventId)

  // Auto-process registration after LinkedIn login
  useEffect(() => {
    const processAfterAuth = async () => {
      // Wait for registration check to complete
      if (sessionStatus !== 'authenticated' || !session || hasProcessedAuth) {
        return
      }

      // Don't process if user is already registered
      if (isRegistered) {
        return
      }

      // Only process when state is stable (not idle, not checking)
      if (registrationState === 'idle' || registrationState === 'checking') {
        return
      }

      // Mark as processed to avoid re-execution
      setHasProcessedAuth(true)

      // Case 1: User needs to fill member form - show modal automatically
      if (registrationState === 'needs_member_form' && needsMemberForm) {
        setShowRegistrationModal(true)
        return
      }

      // Case 2: User is a member but not registered - register automatically
      if (registrationState === 'not_registered' && !needsMemberForm) {
        setIsLoading(true)
        try {
          const result = await registerExistingMember()
          if (result?.success) {
            toast.success(result.message, {
              duration: 5000,
              position: 'top-center',
            })

            // Reload the page to show updated attendees list
            setTimeout(() => {
              router.refresh()
            }, 1000)
          } else if (result) {
            toast.error(result.message)
          }
        } catch (error) {
          console.error('Error al registrar automáticamente:', error)
          toast.error('Error al procesar tu registro. Por favor, intenta nuevamente.')
        } finally {
          setIsLoading(false)
        }
      }
    }

    processAfterAuth()
  }, [
    sessionStatus,
    session,
    hasProcessedAuth,
    registrationState,
    isRegistered,
    needsMemberForm,
    registerExistingMember,
    router,
  ])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Cuando el botón sale de la vista, mostramos el flotante
        setShowFloating(!entry.isIntersecting)
      },
      {
        threshold: 0,
        rootMargin: '-100px 0px 0px 0px',
      },
    )

    const currentButton = buttonRef.current
    if (currentButton) {
      observer.observe(currentButton)
    }

    return () => {
      if (currentButton) {
        observer.unobserve(currentButton)
      }
    }
  }, [])

  // Handle LinkedIn sign-in
  const handleSignIn = async (provider: string) => {
    try {
      setConnecting(true)
      setIsLoading(true)
      await signIn(provider, { callbackUrl: window.location.href })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error('No se pudo conectar con LinkedIn. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
      setConnecting(false)
    }
  }

  // Handle click when user is authenticated
  const handleAuthenticatedClick = async () => {
    // If user needs to fill member form, show modal
    if (needsMemberForm) {
      setShowRegistrationModal(true)
      return
    }

    // If user is already registered, do nothing
    if (isRegistered) {
      return
    }

    // User is a member but not registered - register directly
    setIsLoading(true)
    try {
      const result = await registerExistingMember()
      if (result?.success) {
        toast.success(result.message, {
          duration: 5000,
          position: 'top-center',
        })

        // Reload the page to show updated attendees list
        setTimeout(() => {
          router.refresh()
        }, 1000)
      } else if (result) {
        toast.error(result.message, {
          duration: 5000,
          position: 'top-center',
        })
      }
    } catch (error) {
      console.error('Error al registrar:', error)
      toast.error('Error al procesar tu registro. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  // Handle main button click
  const handleButtonClick = async () => {
    if (sessionStatus === 'loading') {
      return
    }

    if (sessionStatus === 'unauthenticated' || !session) {
      // Not authenticated - sign in with LinkedIn
      await handleSignIn('linkedin')
    } else {
      // Authenticated - proceed with registration logic
      await handleAuthenticatedClick()
    }
  }

  // Handle successful registration modal submission
  const handleRegistrationSuccess = (result: EventRegistrationResult) => {
    markAsRegistered(result)
    setShowRegistrationModal(false)
    toast.success('¡Bienvenido a MedellínJS! Te esperamos en el evento.', {
      duration: 5000,
      position: 'top-center',
    })

    // Reload the page to show updated attendees list
    setTimeout(() => {
      router.refresh()
    }, 1000)
  }

  // Determine button text and icon based on state
  const getButtonContent = () => {
    if (
      isLoading ||
      connecting ||
      registrationState === 'checking' ||
      registrationState === 'registering'
    ) {
      return (
        <div className="flex items-center justify-center gap-2">
          <Spinner size="small" show className="text-white" />
          {registrationState === 'checking' && 'Verificando...'}
          {registrationState === 'registering' && 'Registrando...'}
          {(connecting || isLoading) && !registrationState && 'Procesando...'}
        </div>
      )
    }

    // Always show LinkedIn icon when button is visible
    return (
      <>
        <FaLinkedin className="me-2 text-sm" /> {title}
      </>
    )
  }

  // Determine if button should be disabled
  const isButtonDisabled =
    isLoading ||
    connecting ||
    registrationState === 'checking' ||
    registrationState === 'registering'

  return (
    <>
      {/* Botón original o texto de registrado */}
      <div ref={buttonRef}>
        {isRegistered ? (
          <div className="me-2 mt-2 inline-flex items-center text-base font-semibold text-white">
            <FaCheckCircle className="me-2 text-lg" /> Ya estás registrado
          </div>
        ) : (
          <Button
            onClick={handleButtonClick}
            disabled={isButtonDisabled}
            className={`me-2 mt-2 inline-flex items-center rounded-md border-2 border-red-600 bg-red-600 px-6 py-4 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:scale-105 hover:border-red-700 hover:bg-red-700 ${
              isButtonDisabled ? 'cursor-not-allowed opacity-70' : ''
            }`}
          >
            {getButtonContent()}
          </Button>
        )}
      </div>

      {/* Botón flotante */}
      {showFloating && !isRegistered && (
        <div className="fixed bottom-0 left-0 right-0 z-50 transform border-t border-gray-200 bg-white shadow-2xl transition-transform duration-300 ease-in-out">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-col gap-1">
              {eventTitle && (
                <h3 className="text-sm font-bold text-gray-900 md:text-base">{eventTitle}</h3>
              )}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 md:text-sm">
                {eventDate && (
                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-xs" />
                    <span>{eventDate}</span>
                  </div>
                )}
                {eventTime && (
                  <div className="flex items-center gap-1">
                    <FaClock className="text-xs" />
                    <span>{eventTime}</span>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleButtonClick}
              disabled={isButtonDisabled}
              className="inline-flex items-center rounded-full border-2 border-red-600 bg-red-600 px-6 py-3 text-center text-sm font-semibold tracking-wide text-white duration-500 hover:scale-105 hover:border-red-700 md:px-8 md:py-3 md:text-base"
            >
              {getButtonContent()}
            </Button>
          </div>
        </div>
      )}

      {/* Registration Modal for New Members */}
      {showRegistrationModal && (
        <EventRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          eventId={eventId}
          eventTitle={eventTitle}
          onSuccess={handleRegistrationSuccess}
        />
      )}
    </>
  )
}

export default AttendButton
