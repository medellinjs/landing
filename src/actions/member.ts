'use server';

import { neon } from '@neondatabase/serverless';
import pino from 'pino';

import { createContact } from '@/lib/resend';
import { Member } from '@/lib/types/member';

// Create a logger instance
const logger = pino();

/**
 * Creates a new member
 * @param member The member to create
 * @returns The created member
 */
export async function createMember(member: Member) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  try {
    await createContact(member.email, member.fullName);

    logger.info(`Member created: ${member.email}`);

    const result = await sql`
    INSERT INTO members (
      "id",
      "fullName",
      "email",
      "jobPosition",
      "profileImage",
      "jobLevel",
      "role"
    ) VALUES (
      ${member.id},
      ${member.fullName.trim()},
      ${member.email.trim().toLowerCase()},
      ${member.jobPosition.trim().toUpperCase()},
      ${member.profileImage},
      ${member.jobLevel.trim().toUpperCase()},
      'MEMBER'
    )
    RETURNING *
  `;

    return result;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logger.error(`Error creating member: ${member.email} - ${errorMessage}`);

    return null;
  }
}

/**
 * Retrieves a member by id
 * @param id The id of the member
 * @returns Member
 */
export async function retrieveMember(id: string) {
  const sql = neon(`${process.env.DATABASE_URL}`);

  const result = await sql`
    SELECT * FROM members
    WHERE id = ${id}
  `;

  return result;
}
