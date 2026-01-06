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
import { EventRegistrationForm } from '@/components/events/EventRegistrationForm'
import { createMember } from '@/actions/member'
import type { Member } from '@/lib/types/member'

export interface MemberRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export function MemberRegistrationModal({
  isOpen,
  onClose,
  onSuccess,
}: MemberRegistrationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleFormSuccess = async (memberData: Member) => {
    setIsSubmitting(true)

    try {
      const result = await createMember(memberData)

      if (result) {
        toast.success('¡Bienvenido a MedellínJS! Tu perfil fue creado correctamente.', {
          duration: 5000,
          position: 'top-center',
        })
        onSuccess?.()
        onClose()
        return
      }

      toast.error('No pudimos crear tu perfil. Por favor, intenta nuevamente.', {
        duration: 5000,
        position: 'top-center',
      })
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
            ¡Únete a MedellínJS!
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-600 dark:text-slate-400 sm:text-base">
            Necesitamos algunos datos para crear tu perfil de miembro. Solo tomará un momento.
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
