"use client";
import { motion } from "framer-motion";
import Link from "next/link";

export default function SpeakerCTA() {
  return (
    <section className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-xl p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes una idea para una charla o taller?
          </h2>
          <p className="text-xl mb-8">
            Comparte tu conocimiento con la comunidad MedellínJS. ¡Estamos
            buscando speakers como tú!
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <div className="text-center">
              <Link
                href="/comparte"
                className="py-2 px-5 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md me-2 mt-2"
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
