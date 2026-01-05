import type { CollectionConfig } from 'payload'

export const Speakers: CollectionConfig = {
  slug: 'speakers',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'company'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre completo del speaker',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Ejemplo: Senior Frontend Engineer, Tech Lead, etc.',
      },
    },
    {
      name: 'company',
      type: 'text',
      admin: {
        description: 'Empresa donde trabaja actualmente (opcional)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Foto de perfil del speaker',
      },
    },
    {
      name: 'link',
      type: 'text',
      admin: {
        description: 'Link a perfil social (Twitter, LinkedIn, GitHub, website personal)',
      },
    },
    {
      name: 'bio',
      type: 'richText',
      required: false,
      admin: {
        description: 'Biografía del speaker (puede incluir experiencia, logros, etc.)',
      },
    },
  ],
}
