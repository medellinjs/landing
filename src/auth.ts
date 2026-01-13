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
        console.log('🔑 LinkedIn Account ID:', account.providerAccountId)
        // Use LinkedIn account ID which is always consistent
        token.linkedinId = account.providerAccountId
      }

      // CRITICAL FIX: Ensure linkedinId persists in token
      // If token doesn't have linkedinId but has sub, this might be a refresh
      // We need to maintain linkedinId across token refreshes
      if (!token.linkedinId && token.sub) {
        console.warn('⚠️ Token missing linkedinId, using sub as fallback:', token.sub)
      }

      return token
    },
    session({ session, token }) {
      console.log('🚀 ~ session, token:', session, token)
      // Use LinkedIn ID as the user ID (consistent across logins)
      if (session.user) {
        if (token.linkedinId) {
          session.user.id = token.linkedinId as string
          console.log('✅ session.user.id set to linkedinId:', session.user.id)
        } else if (token.sub) {
          // Fallback to token.sub if linkedinId not available
          // This should only happen in edge cases
          console.warn('⚠️ Using token.sub as user.id, linkedinId not available:', token.sub)
          session.user.id = token.sub
        }
      }
      return session
    },
  },
} satisfies NextAuthConfig

export const { handlers, auth, signIn, signOut } = NextAuth(config)
