import { Resend } from 'resend';

import { TalkSubmited, TalkRegistered } from '@/emailTemplates';

const resend = new Resend(process.env.RESEND_API_KEY);

export type sendEmailType = {
  email: string;
  fullName: string;
  proposalTitle: string;
};
export const sendEmailSubmittedTalk = async (data: sendEmailType) => {
  const { email, fullName, proposalTitle } = data;
  return resend.emails.send({
    from: 'MedellinJS <hola@medellinjs.org>',
    to: [email],
    bcc: ['contacto@medellinjs.org'],
    subject: '¡Hemos recibido tu propuesta para MedellinJS! 🎉',
    react: TalkSubmited({
      fullName: fullName,
      proposalTitle,
    }),
  });
};

export type sendEmailAdminsType = {
  email: string;
  description: string;
  proposalTitle: string;
};
export const sendEmailAdmins = async (data: sendEmailAdminsType) => {
  const { email, description, proposalTitle } = data;
  return resend.emails.send({
    from: 'MedellinJS <hola@medellinjs.org>',
    to: ['contacto@medellinjs.org'],
    subject: '¡Nueva propuesta para MedellinJS! 🎉',
    react: TalkRegistered({
      description,
      email,
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
