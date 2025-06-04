import {
  createContact,
  sendEmailAdmins,
  sendEmailSubmittedTalk,
} from '@/lib/resend';
import { submitTalkFormSchema, SubmitTalkFormType } from '@/lib/types/talks';
import { insertRecord } from '@/lib/airtableService';

const TABLE_NAME = 'Talks';
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

  const fields = {
    fullName: speaker.fullName,
    email: speaker.email,
    role: speaker.role,
    profileImage: speaker.profileImage,
    bio: speaker.bio,
    talkTitle: talk.title,
    description: talk.description,
    level: talk.level,
    type: talk.type,
  };

  await insertRecord(TABLE_NAME, fields);

  await createContact(speaker.email, speaker.fullName);
  const { error } = await sendEmailSubmittedTalk({
    email: speaker.email,
    fullName: speaker.fullName,
    proposalTitle: talk.title,
  });

  await sendEmailAdmins({
    email: speaker.email,
    description: talk.description,
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
