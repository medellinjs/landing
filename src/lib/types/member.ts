import * as z from 'zod'

export const memberSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  nextAuthId: z.string().nonempty({ message: 'El id de NextAuth es requerido' }),
  fullName: z.string().nonempty({ message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'El email es requerido' }),
  jobPosition: z.string().nonempty({ message: 'El rol o cargo es requerido' }),
  profileImage: z
    .string()
    .optional()
    .refine((val) => !val || z.string().url().safeParse(val).success, {
      message: 'Debe ser una url valida',
    }),
  jobLevel: z.string().nonempty({ message: 'El seniority es requerido' }),
})

export type Member = z.infer<typeof memberSchema>

export const memberProfileUpdateSchema = z.object({
  fullName: z.string().min(2, { message: 'El nombre debe tener al menos 2 caracteres' }),
  jobPosition: z.string().min(2, { message: 'El cargo debe tener al menos 2 caracteres' }),
  jobLevel: z.enum(['JUNIOR', 'MID_LEVEL', 'SENIOR', 'LEAD', 'STAFF', 'PRINCIPAL'], {
    errorMap: () => ({ message: 'Selecciona un nivel válido' }),
  }),
  bio: z
    .string()
    .max(500, { message: 'La bio no puede superar los 500 caracteres' })
    .optional()
    .or(z.literal('')),
  socialLinks: z
    .object({
      twitter: z.string().optional().or(z.literal('')),
      linkedin: z.string().url({ message: 'Debe ser una URL válida' }).optional().or(z.literal('')),
      github: z.string().url({ message: 'Debe ser una URL válida' }).optional().or(z.literal('')),
      website: z.string().url({ message: 'Debe ser una URL válida' }).optional().or(z.literal('')),
    })
    .optional(),
})

export type MemberProfileUpdate = z.infer<typeof memberProfileUpdateSchema>
