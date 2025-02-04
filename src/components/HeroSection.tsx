"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

import { Button } from "./ui/button";

export default function HeroSection() {
  return (
    <>
      <section
        className="relative md:py-64 py-36 items-center bg-indigo-600 bg-center bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/bg3.png')" }}
      >
        <div className="container relative">
          <div className="grid grid-cols-1 justify-center text-center">
            <div className="">
              {/* <TextAnimation/> */}
              <h1 className="text-white font-bold lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5">
                MedellinJS
              </h1>
              <p className="text-white/70 text-lg max-w-xl mx-auto">
                Somos una comunidad vibrante de desarrolladores JavaScript
                comprometidos con el aprendizaje continuo y el crecimiento
                profesional en Medellín.
              </p>

              <div className="relative mt-8">
                <Link
                  href="https://www.meetup.com/medellinjs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-5 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-gray-50 hover:bg-gray-200 dark:bg-slate-900 dark:hover:bg-gray-700 hover:border-gray-100 dark:border-gray-700 dark:hover:border-gray-700 rounded-md me-2 mt-2"
                >
                  Ver Próximos Eventos
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      <div className="relative">
        <div className="shape absolute sm:-bottom-px -bottom-[2px] start-0 end-0 overflow-hidden text-white dark:text-slate-900">
          <svg
            className="w-full h-auto scale-[2.0] origin-top"
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
      className="relative table w-full py-36 lg:py-44 bg-gradient-to-br from-indigo-600/20 to-yellow-500/20 dark:from-indigo-600/20 dark:to-yellow-500/20 md:py-56 md:pb-0 overflow-hidden bg-top bg-no-repeat bg-fixed bg-cover"
      style={{ backgroundImage: "url('/bg.png')" }}
    >
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="md:w-1/2 mb-8 md:mb-0"
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-3xl md:text-4xl lg:text-6xl font-bold mb-4"
          >
            Bienvenido a MedellínJS
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-lg md:text-xl mb-6"
          >
            Impulsando la comunidad de desarrolladores JavaScript en Medellín
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4"
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
          className="md:w-1/2 mt-8 md:mt-0"
        >
          <Image
            src="/medjs-talk-web.webp"
            alt="MedellínJS Community"
            width={400}
            height={400}
            className="rounded-lg shadow-lg w-full max-w-md mx-auto"
          />
        </motion.div>
      </div>
    </section>
  );
}
