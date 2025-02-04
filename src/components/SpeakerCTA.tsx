'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function SpeakerCTA() {
  return (
    <section className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="rounded-lg bg-white p-8 text-center shadow-xl"
        >
          <h2 className="mb-4 text-3xl font-bold">
            ¿Tienes una idea para una charla o taller?
          </h2>
          <p className="mb-8 text-xl">
            Comparte tu conocimiento con la comunidad MedellínJS. ¡Estamos
            buscando speakers como tú!
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="text-center">
              <Link
                href="/comparte"
                className="me-2 mt-2 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
              >
                Inscribe tu Charla
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
