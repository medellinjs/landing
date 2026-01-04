import { createContact } from '@/lib/resend'
import { newsletterSchema, Newsletter } from '@/lib/types/newsletter'

export async function POST(req: Request): Promise<Response> {
  const data: Newsletter = await req.json()

  const response = newsletterSchema.safeParse(data)

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

  await createContact(data.email)

  return new Response(JSON.stringify({ saved: true }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  })
}
