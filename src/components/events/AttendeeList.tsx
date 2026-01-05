'use client'

import { useState } from 'react'
import Image from 'next/image'
import { FaArrowRight } from 'react-icons/fa'

interface Attendee {
  name: string
  avatarUrl?: string | null
  id?: string
}

interface AttendeeListProps {
  attendees: Attendee[]
}

const INITIAL_DISPLAY_COUNT = 15

export function AttendeeList({ attendees }: AttendeeListProps) {
  const [showAll, setShowAll] = useState(false)

  if (attendees.length === 0) return null

  const displayedAttendees = showAll ? attendees : attendees.slice(0, INITIAL_DISPLAY_COUNT)
  const hasMore = attendees.length > INITIAL_DISPLAY_COUNT

  return (
    <section className="relative pb-24">
      <div className="container relative mt-16">
        {attendees.length > 0 && (
          <div>
            <div className="mb-8 flex justify-between">
              <h3 className="mb-4 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
                Asistentes ({attendees.length})
              </h3>

              {hasMore && !showAll && (
                <button
                  onClick={() => setShowAll(true)}
                  className="relative inline-flex items-center border-none text-center align-middle text-base font-semibold tracking-wide text-indigo-600 duration-500 after:absolute after:bottom-0 after:end-0 after:start-0 after:h-px after:w-0 after:bg-indigo-600 after:duration-500 after:content-[''] hover:text-indigo-600 hover:after:end-auto hover:after:w-full"
                >
                  Ver todos <FaArrowRight className="ms-2 text-[10px]" />
                </button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {displayedAttendees.map((attendee, index) => (
                <div key={attendee.id || index} className="flex flex-col items-center text-center">
                  {/* Attendee Avatar */}
                  <div className="relative mb-2 h-16 w-16">
                    {attendee.avatarUrl ? (
                      <Image
                        src={attendee.avatarUrl}
                        alt={attendee.name}
                        fill
                        className="mx-auto size-14 rounded-full shadow-md dark:shadow-gray-800"
                        sizes="64px"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-gradient-to-br from-blue-400 to-purple-500 text-xl font-bold text-white">
                        {attendee.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>

                  {/* Attendee Name */}
                  <p className="w-full truncate text-sm text-gray-700" title={attendee.name}>
                    {attendee.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
