'use server'

import pino from 'pino'
import { getPayload } from 'payload'
import config from '@payload-config'

import { createContact } from '@/lib/resend'
import { Member } from '@/lib/types/member'

// Create a logger instance
const logger = pino()

/**
 * Maps form job level values to database values
 */
function mapJobLevel(jobLevel: string): 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD' {
  const mapping: Record<string, 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD'> = {
    junior: 'JUNIOR',
    ssr: 'MID_LEVEL',
    senior: 'SENIOR',
    teachlead: 'LEAD',
  }

  return mapping[jobLevel.toLowerCase()] || 'JUNIOR'
}

/**
 * Creates a new member
 * @param member The member to create
 * @returns The created member
 */
export async function createMember(member: Member) {
  try {
    const payload = await getPayload({ config })

    // Check if member already exists
    const existing = await payload.find({
      collection: 'members',
      where: {
        email: {
          equals: member.email,
        },
      },
    })

    if (existing.docs.length > 0) {
      logger.info(`Member already exists: ${member.email}`)
      return existing.docs[0]
    }

    await createContact(member.email, member.fullName)

    logger.info(`Creating member: ${member.email}`)

    const result = await payload.create({
      collection: 'members',
      data: {
        nextAuthId: member.nextAuthId,
        fullName: member.fullName.trim(),
        email: member.email.trim().toLowerCase(),
        jobPosition: member.jobPosition.trim(),
        ...(member.profileImage && { profileImage: member.profileImage }),
        jobLevel: mapJobLevel(member.jobLevel),
        role: 'MEMBER',
      },
    })

    return result
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error creating member: ${member.email} - ${errorMessage}`)

    return null
  }
}

/**
 * Retrieves a member by NextAuth ID
 * @param nextAuthId The NextAuth user ID
 * @returns Member
 */
export async function retrieveMember(nextAuthId: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'members',
      where: {
        nextAuthId: {
          equals: nextAuthId,
        },
      },
    })

    return result.docs.length > 0 ? result.docs[0] : null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error retrieving member: ${nextAuthId} - ${errorMessage}`)
    return null
  }
}

/**
 * Retrieves a member by email address
 * @param email The member's email address
 * @returns Member or null if not found
 */
export async function retrieveMemberByEmail(email: string) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'members',
      where: {
        email: {
          equals: email.trim().toLowerCase(),
        },
      },
    })

    if (result.docs.length > 0) {
      logger.info(`Member found by email: ${email}`)
      return result.docs[0]
    }

    logger.info(`No member found with email: ${email}`)
    return null
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error retrieving member by email: ${email} - ${errorMessage}`)
    return null
  }
}
