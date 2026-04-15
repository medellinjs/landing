import type { CollectionConfig } from 'payload'

export const Sponsors: CollectionConfig = {
  slug: 'sponsors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'location', 'websiteUrl', 'isActive'],
    description: 'Empresas y organizaciones que patrocinan los eventos de MedellinJS',
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Nombre del sponsor',
      admin: {
        description: 'Nombre de la empresa u organización patrocinadora',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'Logo',
      admin: {
        description: 'Logo oficial del sponsor (preferiblemente en PNG con fondo transparente)',
      },
    },
    {
      name: 'websiteUrl',
      type: 'text',
      required: true,
      label: 'Sitio web',
      admin: {
        description: 'URL del sitio web oficial del sponsor (ej: https://example.com)',
      },
      validate: (value: unknown) => {
        if (!value) return 'El sitio web es requerido'
        if (typeof value !== 'string') return 'Debe ser un texto'
        try {
          new URL(value)
          return true
        } catch {
          return 'Debe ser una URL válida (incluir https://)'
        }
      },
    },
    {
      name: 'location',
      type: 'text',
      label: 'Ciudad / País',
      admin: {
        description: 'Ubicación principal de la empresa (ej: Medellín, Austin, Praga)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Descripción',
      admin: {
        description: 'Breve descripción del sponsor y su relación con la comunidad (opcional)',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      index: true,
      label: 'Activo',
      admin: {
        description: 'Indica si el sponsor está activo y debe mostrarse públicamente',
        position: 'sidebar',
      },
    },
    {
      name: 'tier',
      type: 'select',
      label: 'Nivel de patrocinio',
      defaultValue: 'community',
      options: [
        { label: 'Platino', value: 'platinum' },
        { label: 'Oro', value: 'gold' },
        { label: 'Plata', value: 'silver' },
        { label: 'Comunidad', value: 'community' },
      ],
      admin: {
        description: 'Nivel de patrocinio — define la jerarquía visual en la página del evento',
        position: 'sidebar',
      },
    },
  ],
  timestamps: true,
}
