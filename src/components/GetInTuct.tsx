'use client';
import React from 'react';
import Link from 'next/link';
import { FiPhone } from 'react-icons/fi';

export default function GetInTuct({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 text-center">
        <h6 className="mb-2 text-sm font-bold uppercase text-indigo-600">
          Contáctenos
        </h6>
        <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
          ¿Quieres patrocinar y aportar a nuestra comunidad?
        </h3>

        <p className="mx-auto max-w-xl text-slate-400">
          Juntos, podemos impulsar la innovación y crear un impacto duradero.{' '}
          <br />
          ¡Únete a nosotros y sé parte de la historia de MedellínJS!
        </p>

        <div className="mt-6">
          <Link
            href="mailto:info@medellinjs.org"
            className="mt-4 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
          >
            <FiPhone className="me-1 text-lg" /> Contáctenos
          </Link>
        </div>
      </div>
    </div>
  );
}
