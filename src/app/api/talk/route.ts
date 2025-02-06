import { Resend } from 'resend';

import EmailTemplate from '@/emailTemplates/talkSubmited';

import { submitTalkFormSchema, SubmitTalkFormType } from '@/lib/types/talks';
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request): Promise<Response> {
  const data: SubmitTalkFormType = await req.json();

  const response = submitTalkFormSchema.safeParse(data);

  if (!response.success) {
    const { errors } = response.error;

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
    );
  }

  const { speaker, talk } = response.data;

  const { error } = await resend.emails.send({
    from: 'MedellinJS <hola@medellinjs.org>',
    to: [speaker.email],
    subject: '¡Hemos recibido tu propuesta para MedellinJS! 🎉',
    react: EmailTemplate({
      fullName: speaker.fullName,
      proposalTitle: talk.title,
    }),
  });

  if (error) {
    return new Response(error.message, { status: 400 });
  }

  return new Response(JSON.stringify({ saved: true }), {
    status: 201,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
