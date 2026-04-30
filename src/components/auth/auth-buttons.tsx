'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { FaSignInAlt, FaSignOutAlt, FaUser } from 'react-icons/fa'
import { Button } from '@/components/ui/button'
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
      <DropdownMenuContent
        align="end"
        className="w-52 rounded-xl border border-slate-100 bg-white p-1 shadow-lg dark:border-slate-700 dark:bg-slate-900"
      >
        <DropdownMenuLabel className="px-3 py-2">
          <div className="flex flex-col space-y-0.5">
            <p className="text-sm font-semibold text-slate-900 dark:text-white">{user.name}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />
        <DropdownMenuItem asChild>
          <Link
            href="/profile"
            className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-slate-700 transition hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <FaUser className="mr-2 h-3.5 w-3.5 text-slate-400" />
            Mi Perfil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 bg-slate-100 dark:bg-slate-700" />
        <DropdownMenuItem
          className="flex cursor-pointer items-center rounded-lg px-3 py-2 text-sm text-red-500 transition hover:bg-red-50 focus:bg-red-50 focus:text-red-500 dark:hover:bg-red-950/40"
          onClick={handleSignOut}
          disabled={isLoading}
        >
          <FaSignOutAlt className="mr-2 h-3.5 w-3.5" />
          <span>Cerrar sesión</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
