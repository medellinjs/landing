'use client'

import { useState } from 'react'
import { toast } from 'sonner'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { EventRegistrationForm } from './EventRegistrationForm'
import { registerNewMemberToEvent } from '@/actions/event'
import type { Member } from '@/lib/types/member'
import type { EventRegistrationResult } from '@/lib/types/event'

export interface EventRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  eventId: string
  eventTitle: string
  onSuccess: (result: EventRegistrationResult) => void
}

export function EventRegistrationModal({
  isOpen,
  onClose,
  eventId,
  eventTitle,
  onSuccess,
}: EventRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSuccess = async (memberData: Member) => {
    setIsSubmitting(true)

    try {
      // Register new member and add to event
      const result = await registerNewMemberToEvent(memberData, eventId)

      if (result.success && result.eventRegistered) {
        toast.success(result.message, {
          duration: 5000,
          position: 'top-center',
        })

        // Create EventRegistrationResult for parent callback
        const eventResult: EventRegistrationResult = {
          success: true,
          message: result.message,
          attendee: {
            name: memberData.fullName,
            avatarUrl: memberData.profileImage,
          },
          eventId,
        }

        onSuccess(eventResult)
        onClose()
      } else if (result.memberCreated && !result.eventRegistered) {
        // Member created but event registration failed
        toast.warning(result.message, {
          duration: 7000,
          position: 'top-center',
        })
        onClose()
      } else {
        // Complete failure
        toast.error(result.message, {
          duration: 5000,
          position: 'top-center',
        })
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error inesperado al procesar tu registro'
      toast.error(errorMessage, {
        duration: 5000,
        position: 'top-center',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFormError = (error: Error) => {
    toast.error(error.message || 'Error al procesar el formulario', {
      duration: 5000,
      position: 'top-center',
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-2xl overflow-y-auto overflow-x-hidden bg-white p-4 dark:bg-slate-900 sm:w-[95vw] sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-xl font-semibold leading-tight sm:text-2xl">
            ¡Únete a MedellínJS y Asiste al Evento!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Para asistir a <strong>{eventTitle}</strong>, necesitamos algunos datos para crear tu
            perfil de miembro. Solo tomará un momento. 🚀
          </DialogDescription>
        </DialogHeader>

        <div className="mt-3 sm:mt-4">
          <EventRegistrationForm
            onSuccess={handleFormSuccess}
            onError={handleFormError}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
