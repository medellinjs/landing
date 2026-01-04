import { FC } from 'react'
import Image from 'next/image'
import type { Speaker, Media } from '@/payload-types'
import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'

import styles from './RichTextContent.module.css'

interface SpeakerInfoProps {
  speaker: Speaker
  reverse?: boolean
}

export const SpeakerInfo: FC<SpeakerInfoProps> = ({ speaker, reverse = false }) => {
  const speakerImage = speaker.image as Media | undefined
  const imageUrl = speakerImage?.url || '/placeholder-avatar.jpg'

  return (
    <div className="container relative mb-16">
      <div className="grid grid-cols-1 items-center gap-[30px] md:grid-cols-12">
        <div className={`md:col-span-6 lg:col-span-5 ${reverse ? 'md:order-2' : ''}`}>
          <div className="relative">
            <Image
              src={imageUrl}
              width={0}
              height={0}
              sizes="100vw"
              style={{ width: '100%', height: 'auto' }}
              className="rounded-full"
              alt={speaker.name}
            />
          </div>
        </div>

        <div className={`md:col-span-6 lg:col-span-7 ${reverse ? 'md:order-1' : ''}`}>
          <div className={reverse ? 'lg:me-5' : 'lg:ms-5'}>
            <h6 className="mb-2 text-sm font-bold uppercase text-indigo-600">Speaker</h6>
            <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
              {speaker.name}
            </h3>

            <p className="mb-2 text-sm text-gray-600">
              {speaker.role}
              {speaker.company && ` @ ${speaker.company}`}
            </p>

            <div className={`max-w-xl text-slate-400 ${styles.richTextContent}`}>
              <RichText data={speaker?.bio as SerializedEditorState} />
            </div>

            {/* Speaker Link */}
            {speaker.link && (
              <a
                href={speaker.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-800"
              >
                Ver perfil
                <svg
                  className="ml-1 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
