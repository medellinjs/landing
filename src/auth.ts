import NextAuth from 'next-auth'
import LinkedIn from 'next-auth/providers/linkedin'
import type { NextAuthConfig } from 'next-auth'

export const config = {
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
      if (isProtected) {
        if (isLoggedIn) return true
        return false // Redirect to login page
      }
      return true
    },
    jwt({ token, account, profile }) {
      // Store LinkedIn account ID in token on first sign in
      if (account && profile) {
        // Use LinkedIn account ID which is always consistent
        token.linkedinId = account.providerAccountId
      }
      return token
    },
    session({ session, token }) {
      // Use LinkedIn ID as the user ID (consistent across logins)
      if (session.user && token.linkedinId) {
        session.user.id = token.linkedinId as string
      } else if (session.user && token.sub) {
        // Fallback to token.sub if linkedinId not available
        session.user.id = token.sub
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
