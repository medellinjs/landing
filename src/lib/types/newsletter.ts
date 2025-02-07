import * as z from 'zod';

export const newsletterSchema = z.object({
  email: z.string().email({ message: 'El email es requerido' }),
});

export type Newsletter = z.infer<typeof newsletterSchema>;
