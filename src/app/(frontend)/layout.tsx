import '../../assets/scss/tailwind.scss'
import '../../assets/css/material.css'
import type { Metadata } from 'next'
import { AuthProvider } from '@/components/auth/auth-provider'

import { Nunito, Work_Sans, EB_Garamond, Kaushan_Script, Alex_Brush } from 'next/font/google'

const nunito = Nunito({
  subsets: ['latin'],
  variable: '--font-nunito',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})
const work_sans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-work-sans',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})
const eb_garamond = EB_Garamond({
  subsets: ['latin'],
  variable: '--font-eb-garamond',
  weight: ['400'],
  display: 'swap',
})

const kaushan = Kaushan_Script({
  subsets: ['latin'],
  variable: '--font-kaushan',
  weight: ['400'],
  display: 'swap',
})

const alex = Alex_Brush({
  subsets: ['latin'],
  variable: '--font-alex',
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MedellinJS',
  description:
    'Somos una comunidad vibrante de desarrolladores JavaScript comprometidos con el aprendizaje continuo y el crecimiento profesional en Medellín.',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" dir="ltr">
      <body
        className={`${nunito.variable} ${work_sans.variable} ${eb_garamond.variable} ${kaushan.variable} ${alex.variable} font-nunito text-base text-black dark:bg-slate-900 dark:text-white`}
      >
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
