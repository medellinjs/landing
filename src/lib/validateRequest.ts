import { z } from 'zod'

export const validateRequest = async <T extends z.ZodTypeAny>(
  req: Request,
  schema: T,
): Promise<z.infer<T> | Response> => {
  const data = await req.json()

  const response = schema.safeParse(data)

  if (!response.success) {
    const { errors } = response.error

    return new Response(
      JSON.stringify({
        success: false,
        message: 'Invalid request',
        errors,
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
  }

  return data
}
