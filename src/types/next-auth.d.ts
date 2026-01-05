/**
 * NextAuth Type Extensions
 *
 * Extends NextAuth default types to include custom properties
 * like user.id and user.image for our registration flow.
 */

import 'next-auth'
import 'next-auth/jwt'

declare module 'next-auth' {
  /**
   * Extends the built-in session types to include our custom user properties
   */
  interface Session {
    user: {
      /** User's unique identifier from NextAuth */
      id: string
      /** User's email address from LinkedIn */
      email: string
      /** User's full name from LinkedIn */
      name: string
      /** User's profile image URL from LinkedIn */
      image?: string
    }
  }

  /**
   * Extends the built-in user types
   */
  interface User {
    id: string
    email: string
    name: string
    image?: string
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extends the built-in JWT types
   */
  interface JWT {
    sub: string
    email?: string
    name?: string
    picture?: string
  }
}
