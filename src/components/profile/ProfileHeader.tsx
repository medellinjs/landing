import Image from 'next/image'
import type { Member } from '@/payload-types'

const JOB_LEVEL_LABELS: Record<string, string> = {
  JUNIOR: 'Junior',
  MID_LEVEL: 'Mid-Level',
  SENIOR: 'Senior',
  LEAD: 'Lead',
  STAFF: 'Staff',
  PRINCIPAL: 'Principal',
}

const ROLE_LABELS: Record<string, string> = {
  MEMBER: 'Miembro',
  ORGANIZER: 'Organizador',
  SPEAKER: 'Speaker',
}

interface ProfileHeaderProps {
  member: Member
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-3xl font-bold text-white">
      {initials}
    </div>
  )
}

function formatJoinDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Miembro reciente'
  return new Intl.DateTimeFormat('es-CO', { year: 'numeric', month: 'long' }).format(
    new Date(dateString),
  )
}

export function ProfileHeader({ member }: ProfileHeaderProps) {
  return (
    <div className="flex flex-col items-center gap-6 py-8 sm:flex-row sm:items-start sm:gap-10">
      {/* Avatar */}
      <div className="relative h-28 w-28 flex-shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg dark:border-slate-700 sm:h-36 sm:w-36">
        {member.profileImage ? (
          <Image
            src={member.profileImage}
            alt={`Foto de perfil de ${member.fullName}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 112px, 144px"
          />
        ) : (
          <AvatarFallback name={member.fullName} />
        )}
      </div>

      {/* Info */}
      <div className="text-center sm:text-left">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white md:text-4xl">
          {member.fullName}
        </h1>

        <p className="mt-1 text-lg text-slate-600 dark:text-slate-400">
          {member.jobPosition} <span className="text-slate-400 dark:text-slate-500">·</span>{' '}
          {JOB_LEVEL_LABELS[member.jobLevel] ?? member.jobLevel}
        </p>

        <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
          <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-sm font-medium text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
            {ROLE_LABELS[member.role] ?? member.role}
          </span>

          {member.isActive && (
            <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700 dark:bg-green-900/40 dark:text-green-300">
              Activo
            </span>
          )}

          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-400">
            Desde {formatJoinDate(member.joinedAt)}
          </span>
        </div>

        {member.bio && (
          <p className="mt-4 max-w-xl text-slate-600 dark:text-slate-400">{member.bio}</p>
        )}

        {/* Social links */}
        {member.socialLinks && (
          <div className="mt-4 flex flex-wrap justify-center gap-3 sm:justify-start">
            {member.socialLinks.twitter && (
              <a
                href={`https://twitter.com/${member.socialLinks.twitter.replace('@', '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Twitter/X
              </a>
            )}
            {member.socialLinks.linkedin && (
              <a
                href={member.socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                LinkedIn
              </a>
            )}
            {member.socialLinks.github && (
              <a
                href={member.socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                GitHub
              </a>
            )}
            {member.socialLinks.website && (
              <a
                href={member.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-indigo-600 hover:underline dark:text-indigo-400"
              >
                Sitio web
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
