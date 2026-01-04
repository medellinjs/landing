'use client'
import { TypeAnimation } from 'react-type-animation'

import { Navbar } from '@/components/Navbar'
import Footer from '@/components/Footer'
import { SubmitTalkForm } from '@/components/submitTalk'

export default function SubmitTalk() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <section
        className="relative table w-full bg-green-600 bg-cover bg-center bg-no-repeat py-36 lg:py-44"
        style={{ backgroundImage: "url('/bg3.png')" }}
      >
        <div className="container relative">
          <div className="mt-10 grid grid-cols-1 pb-8 text-center">
            <h1 className="mb-5 text-4xl font-bold leading-normal text-white lg:text-5xl lg:leading-normal">
              Inscribe tu
              <TypeAnimation
                sequence={[' Charla', 2000, ' Taller', 2000, ' Lightning Talk', 2000]}
                wrapper="span"
                speed={10}
                className="typewrite"
                repeat={Infinity}
              />
            </h1>

            <p className="mx-auto max-w-xl text-lg text-slate-300">
              ¿Tienes conocimientos que quieres compartir con la comunidad? <br /> ¡Postula tu
              charla o taller aquí!
            </p>
          </div>
        </div>
      </section>

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
          <SubmitTalkForm />
        </div>
      </section>
      <Footer />
    </>
  )
}
