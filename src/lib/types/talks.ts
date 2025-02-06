import * as z from 'zod';

export const speakerSchema = z.object({
  fullName: z.string().nonempty({ message: 'El nombre es requerido' }),
  email: z.string().email({ message: 'El email es requerido' }),
  role: z.string().nonempty({ message: 'El rol o cargo es requerido' }),
  profileImage: z
    .string({
      message: 'La imagen es requerida',
    })
    .url({ message: 'Debe ser una url valida' }),
  bio: z
    .string()
    .nonempty({ message: 'La biografía es requerida' })
    .min(150, { message: 'La biografía debe tener al menos 150 caracteres' }),
});

export const talkSchema = z.object({
  title: z.string().nonempty({ message: 'El título es requerido' }),
  description: z
    .string()
    .nonempty({ message: 'La descripción es requerida' })
    .min(150, { message: 'La descripción debe tener al menos 150 caracteres' }),
  level: z.string().nonempty({ message: 'El nivel es requerido' }),
  type: z
    .string()
    .nonempty({ message: 'El tipo de presentación es requerido' }),
});

export const submitTalkFormSchema = z.object({
  speaker: speakerSchema,
  talk: talkSchema,
});

export type Speaker = z.infer<typeof speakerSchema>;
export type Talk = z.infer<typeof talkSchema>;
export type SubmitTalkFormType = z.infer<typeof submitTalkFormSchema>;
