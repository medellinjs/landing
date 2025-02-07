import { Resend } from 'resend';

import EmailTemplate from '@/emailTemplates/talkSubmited';

const resend = new Resend(process.env.RESEND_API_KEY);

export type sendEmailType = {
  email: string;
  fullName: string;
  proposalTitle: string;
};
export const sendSubmittedTalk = async (data: sendEmailType) => {
  const { email, fullName, proposalTitle } = data;
  return resend.emails.send({
    from: 'MedellinJS <hola@medellinjs.org>',
    to: [email],
    subject: '¡Hemos recibido tu propuesta para MedellinJS! 🎉',
    react: EmailTemplate({
      fullName: fullName,
      proposalTitle,
    }),
  });
};

export const createContact = async (email: string, fullName?: string) => {
  resend.contacts.create({
    email,
    firstName: fullName,
    unsubscribed: false,
    audienceId: '99353eae-6de9-4108-bbee-c1bcdf6053d8',
  });
};

export const retrieveContact = async (id: string) => {
  return resend.contacts.get({
    id,
    audienceId: '99353eae-6de9-4108-bbee-c1bcdf6053d8',
  });
};
