'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { FaLinkedin } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(true)
      await signIn(provider, { callbackUrl: '/' })
    } catch (error) {
      console.error('Error al iniciar sesión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Iniciar sesión</CardTitle>
          <CardDescription>
            Inicia sesión con tu cuenta de LinkedIn para acceder a MedellínJS
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Button
            className="w-full bg-[#0077b5] hover:bg-[#005e8b]"
            onClick={() => handleSignIn('linkedin')}
            disabled={isLoading}
          >
            <FaLinkedin className="mr-2 h-5 w-5" />
            Continuar con LinkedIn
          </Button>
        </CardContent>
        <CardFooter className="text-muted-foreground flex flex-col space-y-2 text-center text-sm">
          <div>
            Al iniciar sesión, aceptas nuestros{' '}
            <a href="/privacy" className="hover:text-primary underline underline-offset-4">
              términos de servicio y política de privacidad
            </a>
            .
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
