import NextAuth from 'next-auth'
import { getPayload } from 'payload'
import payloadConfig from '@payload-config'
import { authConfig } from './auth.config'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  callbacks: {
    ...authConfig.callbacks,
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.linkedinId as string) || token.sub

        // Use the persistent R2 image URL if the member is already registered,
        // otherwise fall back to the LinkedIn URL (expires ~30 days after issue)
        const linkedinId = session.user.id
        if (linkedinId) {
          try {
            const payload = await getPayload({ config: payloadConfig })
            const result = await payload.find({
              collection: 'members',
              where: { nextAuthId: { equals: linkedinId } },
              limit: 1,
            })
            const storedImage = result.docs[0]?.profileImage
            if (storedImage) {
              session.user.image = storedImage
            }
          } catch {
            // Keep LinkedIn URL from token as fallback
          }
        }
      }
      return session
    },
  },
})
