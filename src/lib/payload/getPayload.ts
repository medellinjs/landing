import { getPayload as getPayloadInstance } from 'payload'
import config from '@/payload.config'

/**
 * Get Payload CMS instance
 * This function is cached by Next.js and will only initialize once
 */
export async function getPayload() {
  return await getPayloadInstance({ config })
}
