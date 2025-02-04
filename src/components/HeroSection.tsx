'use client';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from './ui/button';

export default function HeroSection() {
  return (
    <>
      <section
        className="relative items-center bg-indigo-600 bg-cover bg-center bg-no-repeat py-36 md:py-64"
        style={{ backgroundImage: "url('/bg3.png')" }}
      >
        <div className="container relative">
          <div className="grid grid-cols-1 justify-center text-center">
            <div className="">
              {/* <TextAnimation/> */}
              <h1 className="mb-5 text-4xl font-bold leading-normal text-white lg:text-5xl lg:leading-normal">
                MedellinJS
              </h1>
              <p className="mx-auto max-w-xl text-lg text-white/70">
                Somos una comunidad vibrante de desarrolladores JavaScript
                comprometidos con el aprendizaje continuo y el crecimiento
                profesional en Medellín.
              </p>

              <div className="relative mt-8">
                <Link
                  href="https://www.meetup.com/medellinjs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="me-2 mt-2 inline-flex items-center rounded-md border bg-gray-50 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide duration-500 hover:border-gray-100 hover:bg-gray-200 dark:border-gray-700 dark:bg-slate-900 dark:hover:border-gray-700 dark:hover:bg-gray-700"
                >
                  Ver Próximos Eventos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="relative">
        <div className="shape absolute -bottom-[2px] end-0 start-0 overflow-hidden text-white dark:text-slate-900 sm:-bottom-px">
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
    </>
  );
  return (
    <section
      className="relative table w-full overflow-hidden bg-gradient-to-br from-indigo-600/20 to-yellow-500/20 bg-cover bg-fixed bg-top bg-no-repeat py-36 dark:from-indigo-600/20 dark:to-yellow-500/20 md:py-56 md:pb-0 lg:py-44"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="container mx-auto flex flex-col items-center px-4 md:flex-row">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8 md:mb-0 md:w-1/2"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mb-4 text-3xl font-bold md:text-4xl lg:text-6xl"
          >
            Bienvenido a MedellínJS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mb-6 text-lg md:text-xl"
          >
            Impulsando la comunidad de desarrolladores JavaScript en Medellín
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="default">
                Ver Próximos Eventos
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button size="lg" variant="secondary">
                Suscribirse al Newsletter
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mt-8 md:mt-0 md:w-1/2"
        >
          <Image
            src="/medjs-talk-web.webp"
            alt="MedellínJS Community"
            width={400}
            height={400}
            className="mx-auto w-full max-w-md rounded-lg shadow-lg"
          />
        </motion.div>
      </div>
    </section>
  );
}
