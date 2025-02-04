"use client";
import React from "react";
import Link from "next/link";
import { FiPhone } from "react-icons/fi";

export default function GetInTuct({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="grid grid-cols-1 text-center">
        <h6 className="text-indigo-600 text-sm font-bold uppercase mb-2">
          Contáctenos
        </h6>
        <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
          ¿Quieres patrocinar y aportar a nuestra comunidad?
        </h3>

        <p className="text-slate-400 max-w-xl mx-auto">
          Juntos, podemos impulsar la innovación y crear un impacto duradero.{" "}
          <br />
          ¡Únete a nosotros y sé parte de la historia de MedellínJS!
        </p>

        <div className="mt-6">
          <Link
            href="mailto:info@medellinjs.org"
            className="py-2 px-5 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md mt-4"
          >
            <FiPhone className="me-1 text-lg" /> Contáctenos
          </Link>
        </div>
      </div>
    </div>
  );
}
