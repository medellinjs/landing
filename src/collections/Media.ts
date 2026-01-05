import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
    },
  ],
  upload: {
    // On serverless hosts (Vercel), local disk storage is ephemeral.
    // When S3-compatible storage is configured (e.g., Cloudflare R2), disable local storage
    // so reads/writes go through the adapter.
    disableLocalStorage:
      Boolean(process.env.S3_BUCKET) &&
      Boolean(process.env.S3_ACCESS_KEY_ID) &&
      Boolean(process.env.S3_SECRET_ACCESS_KEY) &&
      Boolean(process.env.S3_ENDPOINT),
  },
}
