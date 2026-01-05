import type { CollectionConfig } from 'payload'

export const Events: CollectionConfig = {
  slug: 'events',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'eventType', 'startDate', 'isPublished', 'updatedAt'],
    description: 'Gestiona los eventos de MedellinJS',
  },
  access: {
    // Public can only read published events
    read: ({ req: { user } }) => {
      if (user) {
        // Authenticated users can see all events
        return true
      }
      // Public can only see published events
      return {
        isPublished: {
          equals: true,
        },
      }
    },
    // Only admins can create/update/delete events
    create: ({ req: { user } }) => Boolean(user),
    update: ({ req: { user } }) => Boolean(user),
    delete: ({ req: { user } }) => Boolean(user),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Título del evento',
      admin: {
        description: 'Nombre descriptivo del evento',
      },
    },
    {
      name: 'eventType',
      type: 'select',
      required: true,
      defaultValue: 'charla',
      label: 'Tipo de evento',
      options: [
        { label: 'Charla', value: 'charla' },
        { label: 'Taller', value: 'taller' },
        { label: 'Panel de Discusión', value: 'panel' },
        { label: 'Hackathon', value: 'hackathon' },
        { label: 'Networking', value: 'networking' },
        { label: 'Lightning Talks', value: 'lightning-talks' },
      ],
      admin: {
        description: 'Categoría del evento según su formato y contenido',
      },
    },
    {
      name: 'slug',
      type: 'text',
      unique: true,
      index: true,
      label: 'Slug (URL)',
      admin: {
        description: 'Se genera automáticamente desde el título. Usado en la URL del evento.',
        position: 'sidebar',
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: true,
      label: 'Descripción',
      admin: {
        description:
          'Descripción completa del evento. Soporta formato rico (negritas, enlaces, etc.)',
      },
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Imagen de portada',
      admin: {
        description: 'Imagen principal del evento para preview y detalle',
      },
    },
    {
      name: 'startDate',
      type: 'date',
      required: true,
      label: 'Fecha y hora de inicio',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Fecha y hora cuando comienza el evento',
      },
    },
    {
      name: 'endDate',
      type: 'date',
      label: 'Fecha y hora de finalización',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        description: 'Fecha y hora cuando termina el evento (opcional)',
      },
    },
    {
      name: 'timezone',
      type: 'select',
      required: true,
      defaultValue: 'America/Bogota',
      label: 'Zona horaria',
      options: [
        { label: 'Colombia (America/Bogota)', value: 'America/Bogota' },
        { label: 'México (America/Mexico_City)', value: 'America/Mexico_City' },
        {
          label: 'Argentina (America/Argentina/Buenos_Aires)',
          value: 'America/Argentina/Buenos_Aires',
        },
        { label: 'Chile (America/Santiago)', value: 'America/Santiago' },
        { label: 'España (Europe/Madrid)', value: 'Europe/Madrid' },
      ],
      admin: {
        description: 'Zona horaria del evento',
      },
    },
    {
      name: 'venue',
      type: 'group',
      label: 'Lugar del evento',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre del lugar',
          admin: {
            description: 'Ej: Ruta N, Centro de Innovación, Virtual',
          },
        },
        {
          name: 'googleMapsUrl',
          type: 'text',
          label: 'URL de Google Maps',
          admin: {
            description: 'Enlace a Google Maps con la ubicación exacta (opcional)',
          },
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Debe ser un texto'
            try {
              const url = new URL(value)
              if (!url.hostname.includes('google.com')) {
                return 'Debe ser una URL de Google Maps'
              }
              return true
            } catch {
              return 'Debe ser una URL válida'
            }
          },
        },
        {
          name: 'extraInfo',
          type: 'textarea',
          label: 'Información adicional',
          admin: {
            description: 'Detalles extra sobre el lugar: piso, sala, indicaciones, etc. (opcional)',
          },
        },
      ],
    },
    {
      name: 'speakers',
      type: 'relationship',
      relationTo: 'speakers',
      hasMany: true,
      label: 'Speakers',
      admin: {
        description: 'Selecciona los speakers que participarán en este evento',
      },
    },
    {
      name: 'attendees',
      type: 'array',
      label: 'Asistentes confirmados',
      admin: {
        description: 'Lista de personas que asistieron al evento (para mostrar en el detalle)',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Nombre',
        },
        {
          name: 'avatarUrl',
          type: 'text',
          label: 'URL del avatar',
          admin: {
            description: 'URL de la foto de perfil del asistente (opcional)',
          },
          validate: (value: unknown) => {
            if (!value) return true
            if (typeof value !== 'string') return 'Debe ser un texto'
            try {
              new URL(value)
              return true
            } catch {
              return 'Debe ser una URL válida'
            }
          },
        },
      ],
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: false,
      label: 'Publicado',
      admin: {
        description: 'Si está marcado, el evento será visible para el público',
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      label: 'Destacado',
      admin: {
        description: 'Si está marcado, el evento aparecerá en la página principal',
        position: 'sidebar',
      },
    },
    {
      name: 'maxAttendees',
      type: 'number',
      label: 'Capacidad máxima',
      admin: {
        description: 'Número máximo de asistentes permitidos (opcional)',
        position: 'sidebar',
      },
    },
    {
      name: 'tags',
      type: 'array',
      label: 'Etiquetas',
      admin: {
        description: 'Etiquetas para categorizar el evento (React, Node.js, Workshop, etc.)',
      },
      fields: [
        {
          name: 'tag',
          type: 'text',
          required: true,
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from title if not provided
        if (data?.title && !data?.slug) {
          data.slug = data.title
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '') // Remove accents
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphens
            .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
        }
        return data
      },
    ],
  },
  timestamps: true,
}
