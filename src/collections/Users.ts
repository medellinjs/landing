import type { CollectionConfig } from 'payload'

const ALLOWED_EMAIL_DOMAIN = 'medellinjs.org'

const isAllowedEmail = (email: unknown): boolean => {
  if (typeof email !== 'string') return false
  return email.toLowerCase().endsWith(`@${ALLOWED_EMAIL_DOMAIN}`)
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    description: 'Usuarios con acceso al panel de administración',
  },
  auth: true,
  fields: [
    {
      // Override Payload's default auth email field to enforce domain restriction
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      index: true,
      validate: (value) => {
        if (!isAllowedEmail(value)) {
          return `Email must be a @${ALLOWED_EMAIL_DOMAIN} address`
        }
        return true
      },
      admin: {
        description: `Solo se permiten correos con dominio @${ALLOWED_EMAIL_DOMAIN}`,
      },
    },
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre del usuario administrativo',
      },
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Organizador', value: 'organizer' },
      ],
      defaultValue: 'organizer',
      required: true,
      admin: {
        description: 'Rol del usuario en la plataforma (determina permisos en el admin)',
      },
    },
  ],
}
