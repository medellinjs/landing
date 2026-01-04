'use client'
import type { FC } from 'react'
import Link from 'next/link'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { teamData } from '@assets/data'
import OrganizerCard from './OrganizerCard'

const ActiveOrganizersSection: FC = () => {
  return (
    <section className="relative py-16 md:py-24">
      <div className="container relative py-16 md:py-24">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
            Nuestros Organizadores
          </h3>

          <p className="mx-auto max-w-xl text-slate-400">
            Detrás de cada evento de MedellínJS hay un equipo apasionado y comprometido que trabaja
            incansablemente para crear experiencias memorables.
          </p>
        </div>

        <div className="mb-8 mt-8 grid grid-cols-1 items-center gap-8 md:grid-cols-12">
          {teamData
            .filter((team) => team.isActive)
            .map((item, index) => {
              return (
                <OrganizerCard
                  key={index}
                  name={item.name}
                  description={item.desc}
                  image={item.image}
                  title={item.title}
                  bgIndex={index}
                  socialNetworks={item.socialNetworks}
                />
              )
            })}
        </div>

        <div className="grid grid-cols-1 justify-center">
          <div className="mt-6 text-center">
            <Link
              href="/team"
              className="me-2 mt-2 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
            >
              Ver Todos los Organizadores <MdKeyboardArrowRight className="ms-1 text-xl" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ActiveOrganizersSection
