'use client'

import { useState, useRef, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import Image from 'next/image'

import { memberProfileUpdateSchema, type MemberProfileUpdate } from '@/lib/types/member'
import { updateOwnProfile } from '@/actions/member'
import type { Member } from '@/payload-types'

const JOB_LEVELS = [
  { value: 'JUNIOR', label: 'Junior' },
  { value: 'MID_LEVEL', label: 'Mid-Level' },
  { value: 'SENIOR', label: 'Senior' },
  { value: 'LEAD', label: 'Lead' },
  { value: 'STAFF', label: 'Staff' },
  { value: 'PRINCIPAL', label: 'Principal' },
] as const

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE_MB = 5

interface ProfileFormProps {
  member: Member
}

export function ProfileForm({ member }: ProfileFormProps) {
  const [isPending, startTransition] = useTransition()
  const [imagePreview, setImagePreview] = useState<string | null>(member.profileImage ?? null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<MemberProfileUpdate>({
    resolver: zodResolver(memberProfileUpdateSchema),
    defaultValues: {
      fullName: member.fullName,
      jobPosition: member.jobPosition,
      jobLevel: member.jobLevel as MemberProfileUpdate['jobLevel'],
      bio: member.bio ?? '',
      socialLinks: {
        twitter: member.socialLinks?.twitter ?? '',
        linkedin: member.socialLinks?.linkedin ?? '',
        github: member.socialLinks?.github ?? '',
        website: member.socialLinks?.website ?? '',
      },
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Formato no válido. Usa JPG, PNG o WebP.', { position: 'top-center' })
      return
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`La imagen no puede superar los ${MAX_SIZE_MB}MB.`, { position: 'top-center' })
      return
    }

    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const onSubmit = (data: MemberProfileUpdate) => {
    startTransition(async () => {
      const result = await updateOwnProfile(data, imageFile ?? undefined)

      if (result.success) {
        toast.success('Perfil actualizado correctamente.', {
          duration: 4000,
          position: 'top-center',
        })
        setImageFile(null)
      } else {
        toast.error(result.error ?? 'Error al actualizar el perfil.', {
          duration: 5000,
          position: 'top-center',
        })
      }
    })
  }

  const inputClass =
    'w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:border-indigo-400'
  const labelClass = 'block text-sm font-medium text-slate-700 dark:text-slate-300'
  const errorClass = 'mt-1 text-xs text-red-500'

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      {/* Profile image */}
      <div>
        <p className={labelClass}>Foto de perfil</p>
        <div className="mt-2 flex items-center gap-5">
          <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-full border-2 border-slate-200 dark:border-slate-700">
            {imagePreview ? (
              <Image
                src={imagePreview}
                alt="Vista previa"
                fill
                className="object-cover"
                sizes="80px"
                unoptimized={imageFile !== null}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-2xl font-bold text-white">
                {member.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          <div>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
            >
              Cambiar imagen
            </button>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-500">
              JPG, PNG o WebP · máx. {MAX_SIZE_MB}MB
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>
        </div>
      </div>

      {/* Email (read-only) */}
      <div>
        <label className={labelClass}>
          Email
          <span className="ml-2 text-xs font-normal text-slate-400">(proviene de LinkedIn)</span>
        </label>
        <input
          type="email"
          value={member.email}
          disabled
          className={`${inputClass} mt-1 cursor-not-allowed opacity-60`}
        />
      </div>

      {/* Basic info */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fullName" className={labelClass}>
            Nombre completo <span className="text-red-500">*</span>
          </label>
          <input
            id="fullName"
            type="text"
            {...register('fullName')}
            className={`${inputClass} mt-1`}
          />
          {errors.fullName && <p className={errorClass}>{errors.fullName.message}</p>}
        </div>

        <div>
          <label htmlFor="jobPosition" className={labelClass}>
            Cargo / Posición <span className="text-red-500">*</span>
          </label>
          <input
            id="jobPosition"
            type="text"
            {...register('jobPosition')}
            className={`${inputClass} mt-1`}
          />
          {errors.jobPosition && <p className={errorClass}>{errors.jobPosition.message}</p>}
        </div>

        <div>
          <label htmlFor="jobLevel" className={labelClass}>
            Nivel de experiencia <span className="text-red-500">*</span>
          </label>
          <select id="jobLevel" {...register('jobLevel')} className={`${inputClass} mt-1`}>
            {JOB_LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>
                {lvl.label}
              </option>
            ))}
          </select>
          {errors.jobLevel && <p className={errorClass}>{errors.jobLevel.message}</p>}
        </div>
      </div>

      {/* Bio */}
      <div>
        <label htmlFor="bio" className={labelClass}>
          Bio{' '}
          <span className="text-xs font-normal text-slate-400">
            (opcional · máx. 500 caracteres)
          </span>
        </label>
        <textarea
          id="bio"
          rows={3}
          {...register('bio')}
          className={`${inputClass} mt-1`}
          placeholder="Cuéntanos un poco sobre ti…"
        />
        {errors.bio && <p className={errorClass}>{errors.bio.message}</p>}
      </div>

      {/* Social links */}
      <div>
        <p className={`${labelClass} mb-3`}>Redes sociales</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="twitter" className="block text-xs text-slate-500 dark:text-slate-400">
              Twitter / X
            </label>
            <input
              id="twitter"
              type="text"
              {...register('socialLinks.twitter')}
              className={`${inputClass} mt-1`}
              placeholder="@username"
            />
            {errors.socialLinks?.twitter && (
              <p className={errorClass}>{errors.socialLinks.twitter.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="linkedin" className="block text-xs text-slate-500 dark:text-slate-400">
              LinkedIn
            </label>
            <input
              id="linkedin"
              type="url"
              {...register('socialLinks.linkedin')}
              className={`${inputClass} mt-1`}
              placeholder="https://linkedin.com/in/..."
            />
            {errors.socialLinks?.linkedin && (
              <p className={errorClass}>{errors.socialLinks.linkedin.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="github" className="block text-xs text-slate-500 dark:text-slate-400">
              GitHub
            </label>
            <input
              id="github"
              type="url"
              {...register('socialLinks.github')}
              className={`${inputClass} mt-1`}
              placeholder="https://github.com/..."
            />
            {errors.socialLinks?.github && (
              <p className={errorClass}>{errors.socialLinks.github.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="website" className="block text-xs text-slate-500 dark:text-slate-400">
              Sitio web
            </label>
            <input
              id="website"
              type="url"
              {...register('socialLinks.website')}
              className={`${inputClass} mt-1`}
              placeholder="https://..."
            />
            {errors.socialLinks?.website && (
              <p className={errorClass}>{errors.socialLinks.website.message}</p>
            )}
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={isPending || (!isDirty && !imageFile)}
          className="inline-flex items-center gap-2 rounded-md border border-indigo-600 bg-indigo-600 px-6 py-2 text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? 'Guardando…' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}
