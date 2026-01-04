'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserAuthProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
  } | null
}

export function UserAuthButton({ user }: UserAuthProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsLoading(true)
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Error al cerrar sesión:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return (
      <Button
        variant="outline"
        onClick={() => router.push('/auth/signin')}
        className="flex items-center gap-2"
      >
        <FaSignInAlt className="h-4 w-4" />
        <span className="hidden sm:inline">Iniciar sesión</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.image || ''} alt={user.name || 'Usuario'} />
                  <AvatarFallback>
                    {user.name ? (
                      user.name
                        .split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase()
                    ) : (
                      <FaUser />
                    )}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Perfil de usuario</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="font-medium">{user.name}</p>
            <p className="text-muted-foreground text-xs">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/dashboard">Dashboard</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/profile">Perfil</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-red-500 focus:text-red-500"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <FaSignOutAlt className="mr-2 h-4 w-4" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
