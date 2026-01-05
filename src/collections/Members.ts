import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'jobPosition', 'jobLevel'],
    description: 'Miembros de la comunidad MedellinJS',
  },
  access: {
    read: () => true, // Público para mostrar en el sitio
    create: () => false, // No permite registro público
    update: ({ req: { user } }) => {
      if (!user) return false
      // Type assertion since we know Users collection has role field
      const userWithRole = user as any
      if (userWithRole?.role === 'admin' || userWithRole?.role === 'organizer') return true
      return false
    },
    delete: ({ req: { user } }) => {
      if (!user) return false
      const userWithRole = user as any
      return userWithRole?.role === 'admin'
    },
  },
  fields: [
    {
      name: 'nextAuthId',
      type: 'text',
      unique: true,
      admin: {
        description: 'ID del usuario en NextAuth',
        position: 'sidebar',
      },
    },
    {
      name: 'fullName',
      type: 'text',
      required: true,
      admin: {
        description: 'Nombre completo del miembro',
      },
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
      admin: {
        description: 'Email del miembro',
      },
    },
    {
      name: 'profileImage',
      type: 'text',
      admin: {
        description: 'URL de la imagen de perfil',
      },
    },
    {
      name: 'jobPosition',
      type: 'text',
      required: true,
      admin: {
        description: 'Cargo o posición laboral',
      },
    },
    {
      name: 'jobLevel',
      type: 'select',
      required: true,
      options: [
        { label: 'Junior', value: 'JUNIOR' },
        { label: 'Mid-Level', value: 'MID_LEVEL' },
        { label: 'Senior', value: 'SENIOR' },
        { label: 'Lead', value: 'LEAD' },
        { label: 'Staff', value: 'STAFF' },
        { label: 'Principal', value: 'PRINCIPAL' },
      ],
      admin: {
        description: 'Nivel de experiencia',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'MEMBER',
      options: [
        { label: 'Miembro', value: 'MEMBER' },
        { label: 'Organizador', value: 'ORGANIZER' },
        { label: 'Speaker', value: 'SPEAKER' },
      ],
      admin: {
        description: 'Rol del miembro en la comunidad',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      admin: {
        description: 'Biografía o descripción del miembro (opcional)',
      },
    },
    {
      name: 'socialLinks',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          admin: {
            placeholder: '@username',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            placeholder: 'https://linkedin.com/in/...',
          },
        },
        {
          name: 'github',
          type: 'text',
          admin: {
            placeholder: 'https://github.com/...',
          },
        },
        {
          name: 'website',
          type: 'text',
          admin: {
            placeholder: 'https://...',
          },
        },
      ],
      admin: {
        description: 'Redes sociales del miembro (opcional)',
      },
    },
    {
      name: 'joinedAt',
      type: 'date',
      admin: {
        description: 'Fecha en que se unió a la comunidad',
        position: 'sidebar',
      },
      defaultValue: () => new Date().toISOString(),
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Miembro activo en la comunidad',
        position: 'sidebar',
      },
    },
  ],
}
