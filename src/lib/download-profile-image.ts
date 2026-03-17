import pino from 'pino'
import { getPayload } from 'payload'
import config from '@payload-config'

const logger = pino()

/**
 * Downloads an external profile image and uploads it to Payload's media collection
 * (stored in Cloudflare R2 via the S3 adapter). Returns the persistent URL so we no
 * longer depend on expiring LinkedIn CDN links.
 */
export async function downloadAndStoreProfileImage(
  externalUrl: string,
  memberName: string,
): Promise<string | null> {
  try {
    const response = await fetch(externalUrl, { signal: AbortSignal.timeout(10_000) })

    if (!response.ok) {
      logger.warn(`Failed to download profile image (${response.status}): ${externalUrl}`)
      return null
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg'
    const buffer = Buffer.from(await response.arrayBuffer())

    if (buffer.length === 0) {
      logger.warn('Downloaded profile image is empty')
      return null
    }

    const extension = contentType.includes('png') ? 'png' : 'jpg'
    const safeName = memberName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
    const filename = `avatar-${safeName}-${Date.now()}.${extension}`

    const payload = await getPayload({ config })

    const media = await payload.create({
      collection: 'media',
      data: { alt: `Foto de perfil de ${memberName}` },
      file: {
        data: buffer,
        mimetype: contentType,
        name: filename,
        size: buffer.length,
      },
    })

    if (media?.url) {
      logger.info(`Profile image stored in media collection: ${media.url}`)
      return media.url
    }

    return null
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error)
    logger.error(`Error downloading/storing profile image: ${msg}`)
    return null
  }
}
