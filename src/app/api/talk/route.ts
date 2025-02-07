import { createContact, sendSubmittedTalk } from '@/lib/resend';
import { submitTalkFormSchema, SubmitTalkFormType } from '@/lib/types/talks';

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

  await createContact(speaker.email, speaker.fullName);
  const { error } = await sendSubmittedTalk({
    email: speaker.email,
    fullName: speaker.fullName,
    proposalTitle: talk.title,
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
