import * as z from 'zod'

export const memberSchema = z.object({
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
