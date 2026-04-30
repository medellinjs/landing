import LinkedIn from 'next-auth/providers/linkedin'
import type { NextAuthConfig } from 'next-auth'

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    LinkedIn({
      clientId: process.env.LINKEDIN_CLIENT_ID,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isProtected = nextUrl.pathname.startsWith('/dashboard')
      if (isProtected) return isLoggedIn
      return true
    },
    jwt({ token, account }) {
      if (account) {
        token.linkedinId = account.providerAccountId
      }
      return token
    },
  },
} satisfies NextAuthConfig
