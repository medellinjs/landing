import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { MdKeyboardArrowRight } from 'react-icons/md'

import { auth } from '@/auth'
import { retrieveMember, getAttendedPastEvents } from '@/actions/member'
import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { ProfileHeader } from '@/components/profile/ProfileHeader'
import { ProfileForm } from '@/components/profile/ProfileForm'
import { AttendedEventsList } from '@/components/profile/AttendedEventsList'
import type { Event } from '@/payload-types'

export const metadata: Metadata = {
  title: 'Mi Perfil | MedellinJS',
  description: 'Gestiona tu perfil en la comunidad MedellinJS',
}

export default async function ProfilePage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect('/auth/signin')
  }

  const member = await retrieveMember(String(session.user.id))

  if (!member) {
    redirect('/')
  }

  const pastEvents = await getAttendedPastEvents(member.id)

  return (
    <>
      <Navbar navClass="nav-light" />

      {/* Hero banner */}
      <section
        className="relative table w-full bg-indigo-600 bg-cover bg-center bg-no-repeat py-36 lg:py-44"
        style={{ backgroundImage: "url('/bg1.png')" }}
      >
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 pb-8 text-center">
            <h3 className="mb-4 text-3xl font-medium leading-normal text-white md:text-4xl md:leading-normal">
              Mi Perfil
            </h3>
            <p className="mx-auto max-w-xl text-slate-300">
              Administra tu información de miembro en la comunidad MedellinJS.
            </p>
          </div>
        </div>

        <div className="absolute bottom-5 end-0 start-0 z-10 mx-3 text-center">
          <ul className="mx-auto mb-0 inline-flex space-x-1 tracking-[0.5px]">
            <li className="inline-block text-[13px] font-bold uppercase text-white/50 duration-500 ease-in-out hover:text-white">
              Inicio
            </li>
            <li className="mx-0.5 inline-block text-base text-white/50 ltr:rotate-0 rtl:rotate-180">
              <MdKeyboardArrowRight className="text-xl" />
            </li>
            <li
              className="inline-block text-[13px] font-bold uppercase text-white duration-500 ease-in-out"
              aria-current="page"
            >
              Mi Perfil
            </li>
          </ul>
        </div>
      </section>

      {/* Wave divider */}
      <div className="relative">
        <div className="shape absolute -bottom-[2px] end-0 start-0 z-1 overflow-hidden text-white dark:text-slate-900 sm:-bottom-px">
          <svg
            className="h-auto w-full origin-top scale-[2.0]"
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="relative py-16 md:py-24">
        <div className="container relative">
          {/* Profile header — avatar, name, role, bio */}
          <div className="rounded-xl bg-white px-6 py-8 shadow-md dark:bg-slate-800 sm:px-10">
            <ProfileHeader member={member} />
          </div>

          {/* Edit form */}
          <div className="mt-10 rounded-xl bg-white px-6 py-8 shadow-md dark:bg-slate-800 sm:px-10">
            <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
              Editar información
            </h2>
            <ProfileForm member={member} />
          </div>

          {/* Attended events */}
          <div className="mt-10 rounded-xl bg-white px-6 py-8 shadow-md dark:bg-slate-800 sm:px-10">
            <h2 className="mb-6 text-xl font-semibold text-slate-900 dark:text-white">
              Eventos a los que asistí
            </h2>
            <AttendedEventsList events={pastEvents as Event[]} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
