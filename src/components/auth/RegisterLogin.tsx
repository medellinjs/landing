'use client'

import { useState, useEffect } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { toast } from 'sonner'
import { LuUser } from 'react-icons/lu'

import { Button } from '@/components/ui/button'
import { Spinner } from '@/components/ui/spinner'
import { MemberRegistrationModal } from '@/components/members/MemberRegistrationModal'
import { retrieveMember } from '@/actions/member'

const MEMBER_JOIN_INTENT_KEY = 'medellinjs:member-join-intent'

export const RegisterLoginButton = () => {
  const { data: session, status: sessionStatus } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [isMember, setIsMember] = useState<boolean | null>(null)
  const [showRegistrationModal, setShowRegistrationModal] = useState(false)

  const nextAuthId = session?.user?.id

  useEffect(() => {
    const checkMember = async () => {
      if (sessionStatus !== 'authenticated' || !nextAuthId) return
      setIsLoading(true)

      try {
        const member = await retrieveMember(String(nextAuthId))
        if (member) {
          setIsMember(true)
          setShowRegistrationModal(false)
          return
        }

        setIsMember(false)
        // Do NOT auto-open modal on page load/refresh.
        // Only open it after an explicit user click that initiated login.
        if (typeof window !== 'undefined') {
          const shouldOpen =
            window.sessionStorage.getItem(MEMBER_JOIN_INTENT_KEY) === '1' && Boolean(nextAuthId)
          if (shouldOpen) {
            window.sessionStorage.removeItem(MEMBER_JOIN_INTENT_KEY)
            setShowRegistrationModal(true)
          }
        }
      } catch (error) {
        console.error('Error checking member:', error)
        setIsMember(false)
        toast.error('No pudimos verificar tu perfil. Intenta nuevamente.', {
          duration: 5000,
          position: 'top-center',
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkMember()
  }, [sessionStatus, nextAuthId])

  // Handle LinkedIn sign-in
  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true)
      // Persist intent across OAuth redirect so we can open the modal
      // only when the user explicitly clicked the button.
      if (typeof window !== 'undefined') {
        window.sessionStorage.setItem(MEMBER_JOIN_INTENT_KEY, '1')
      }
      await signIn(provider, { callbackUrl: window.location.href })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
      toast.error('No se pudo conectar con LinkedIn. Por favor, intenta nuevamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const checkMemberAndOpenModalIfMissing = async () => {
    if (sessionStatus !== 'authenticated' || !nextAuthId) return

    setIsLoading(true)
    try {
      const member = await retrieveMember(String(nextAuthId))
      if (member) {
        setIsMember(true)
        setShowRegistrationModal(false)
        return
      }

      setIsMember(false)
      setShowRegistrationModal(true)
    } catch (error) {
      console.error('Error checking member:', error)
      setIsMember(false)
      toast.error('No pudimos verificar tu perfil. Intenta nuevamente.', {
        duration: 5000,
        position: 'top-center',
      })
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
      // Authenticated - only open modal after explicit click
      await checkMemberAndOpenModalIfMissing()
    }
  }

  // Determine button text and icon based on state
  const getButtonContent = () => {
    if (isLoading) {
      return (
        <span className="inline-flex size-9 items-center justify-center rounded-full border bg-gray-50 text-center align-middle text-base tracking-wide transition duration-500 ease-in-out hover:border-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-slate-900 dark:hover:border-gray-700 dark:hover:bg-gray-700">
          <Spinner size="small" show className="text-slate-700 dark:text-slate-200" />
        </span>
      )
    }

    return (
      <span className="inline-flex size-9 items-center justify-center rounded-full border bg-gray-50 text-center align-middle text-base tracking-wide transition duration-500 ease-in-out hover:border-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-slate-900 dark:hover:border-gray-700 dark:hover:bg-gray-700">
        <LuUser className="size-4" />
      </span>
    )
  }

  // Determine if button should be disabled
  const isButtonDisabled = isLoading || sessionStatus === 'loading'

  // If user is already a member, hide the button completely
  if (sessionStatus === 'authenticated' && isMember === true) {
    return null
  }

  return (
    <>
      <Button
        onClick={handleButtonClick}
        disabled={isButtonDisabled}
        className={`inline-flex items-center bg-transparent p-0 ${
          isButtonDisabled ? 'cursor-not-allowed opacity-70' : ''
        }`}
        aria-label="Iniciar sesión con LinkedIn"
      >
        {getButtonContent()}
      </Button>

      {/* Member Registration Modal */}
      {showRegistrationModal && (
        <MemberRegistrationModal
          isOpen={showRegistrationModal}
          onClose={() => setShowRegistrationModal(false)}
          onSuccess={() => {
            setIsMember(true)
            setShowRegistrationModal(false)
          }}
        />
      )}
    </>
  )
}

export default RegisterLoginButton
