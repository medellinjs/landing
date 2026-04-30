'use server'

import pino from 'pino'
import { getPayload } from 'payload'
import config from '@payload-config'
import { revalidatePath } from 'next/cache'

import { auth } from '@/auth'
import { createContact } from '@/lib/resend'
import { downloadAndStoreProfileImage } from '@/lib/download-profile-image'
import { Member, memberProfileUpdateSchema, MemberProfileUpdate } from '@/lib/types/member'

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

    // Check if member already exists by email
    const existing = await payload.find({
      collection: 'members',
      where: {
        email: {
          equals: member.email,
        },
      },
    })

    if (existing.docs.length > 0) {
      const existingMember = existing.docs[0]
      logger.info(`Member already exists: ${member.email}`)

      const updates: Record<string, string | undefined> = {}

      if (existingMember.nextAuthId !== member.nextAuthId) {
        logger.warn(
          `Updating nextAuthId for ${member.email} from ${existingMember.nextAuthId} to ${member.nextAuthId}`,
        )
        updates.nextAuthId = member.nextAuthId
      }

      // Re-download only when LinkedIn sends a new source URL (their URLs expire ~30 days)
      if (member.profileImage && existingMember.linkedinImageUrl !== member.profileImage) {
        logger.info(`New LinkedIn image URL detected for ${member.email}, downloading…`)
        const localUrl = await downloadAndStoreProfileImage(member.profileImage, member.fullName)
        if (localUrl) {
          updates.profileImage = localUrl
          updates.linkedinImageUrl = member.profileImage
        }
        // If download fails, keep existing profileImage — do NOT store the expiring LinkedIn URL
      }

      if (Object.keys(updates).length > 0) {
        await payload.update({
          collection: 'members',
          id: existingMember.id,
          data: updates,
        })
        return { ...existingMember, ...updates }
      }

      return existingMember
    }

    await createContact(member.email, member.fullName)

    logger.info(`Creating member: ${member.email}`)

    let storedProfileImage: string | undefined
    let linkedinImageUrl: string | undefined
    if (member.profileImage) {
      const localUrl = await downloadAndStoreProfileImage(member.profileImage, member.fullName)
      if (localUrl) {
        storedProfileImage = localUrl
        linkedinImageUrl = member.profileImage
      }
      // If download fails, leave profileImage empty — never store an expiring LinkedIn URL
    }

    const result = await payload.create({
      collection: 'members',
      data: {
        nextAuthId: member.nextAuthId,
        fullName: member.fullName.trim(),
        email: member.email.trim().toLowerCase(),
        jobPosition: member.jobPosition.trim(),
        ...(storedProfileImage && { profileImage: storedProfileImage }),
        ...(linkedinImageUrl && { linkedinImageUrl }),
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

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_IMAGE_SIZE = 5 * 1024 * 1024 // 5MB

export type UpdateProfileResult = { success: true } | { success: false; error: string }

/**
 * Updates the profile of the currently authenticated member.
 * Authorization is enforced via NextAuth session (nextAuthId),
 * never trusting a client-supplied member ID.
 */
export async function updateOwnProfile(
  input: MemberProfileUpdate,
  imageFile?: File,
): Promise<UpdateProfileResult> {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return { success: false, error: 'No autenticado' }
    }

    const nextAuthId = String(session.user.id)

    const parsed = memberProfileUpdateSchema.safeParse(input)
    if (!parsed.success) {
      const firstError = parsed.error.errors[0]?.message ?? 'Datos inválidos'
      return { success: false, error: firstError }
    }

    const payload = await getPayload({ config })

    // Always look up member by session nextAuthId to prevent IDOR
    const result = await payload.find({
      collection: 'members',
      where: { nextAuthId: { equals: nextAuthId } },
      limit: 1,
    })

    if (result.docs.length === 0) {
      return { success: false, error: 'Perfil no encontrado' }
    }

    const member = result.docs[0]
    const updateData: Record<string, unknown> = { ...parsed.data }

    if (imageFile) {
      if (!ALLOWED_IMAGE_TYPES.includes(imageFile.type)) {
        return { success: false, error: 'Formato de imagen no válido (usa JPG, PNG o WebP)' }
      }
      if (imageFile.size > MAX_IMAGE_SIZE) {
        return { success: false, error: 'La imagen no puede superar los 5MB' }
      }

      const arrayBuffer = await imageFile.arrayBuffer()
      const media = await payload.create({
        collection: 'media',
        data: { alt: `Foto de perfil de ${member.fullName}` },
        file: {
          data: Buffer.from(arrayBuffer),
          mimetype: imageFile.type,
          name: imageFile.name,
          size: imageFile.size,
        },
      })

      if (media?.url) {
        updateData.profileImage = media.url
        // Clear the LinkedIn source URL so the auto-redownload flow doesn't overwrite the new image
        updateData.linkedinImageUrl = null
        logger.info(`Profile image updated for member ${member.id}: ${media.url}`)
      }
    }

    await payload.update({
      collection: 'members',
      id: member.id,
      data: updateData,
      overrideAccess: true,
    })

    revalidatePath('/profile')
    logger.info(`Member profile updated: ${member.id}`)

    return { success: true }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error updating member profile: ${errorMessage}`)
    return { success: false, error: 'Error al actualizar el perfil. Intenta nuevamente.' }
  }
}

/**
 * Returns the past events (startDate < now) where the given member is listed as an attendee.
 */
export async function getAttendedPastEvents(memberId: number) {
  try {
    const payload = await getPayload({ config })

    const result = await payload.find({
      collection: 'events',
      where: {
        and: [
          { attendees: { contains: memberId } },
          { startDate: { less_than: new Date().toISOString() } },
          { isPublished: { equals: true } },
        ],
      },
      sort: '-startDate',
      depth: 1,
      limit: 50,
    })

    return result.docs
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error)
    logger.error(`Error fetching attended past events for member ${memberId}: ${errorMessage}`)
    return []
  }
}
