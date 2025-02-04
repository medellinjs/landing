"use client";
import type { FC } from "react";
import Link from "next/link";
import { MdKeyboardArrowRight } from "react-icons/md";

import { teamData } from "@assets/data";
import OrganizerCard from "./OrganizerCard";

const ActiveOrganizersSection: FC = () => {
  return (
    <section className="relative md:py-24 py-16">
      <div className="container relative md:py-24 py-16">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
            Nuestros Organizadores
          </h3>

          <p className="text-slate-400 max-w-xl mx-auto">
            Detrás de cada evento de MedellínJS hay un equipo apasionado y
            comprometido que trabaja incansablemente para crear experiencias
            memorables.
          </p>
        </div>

        <div className="grid md:grid-cols-12 grid-cols-1 items-center mt-8 gap-8 mb-8">
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
                  background={item.background}
                  socialNetworks={item.socialNetworks}
                />
              );
            })}
        </div>

        <div className="grid grid-cols-1 justify-center">
          <div className="mt-6 text-center">
            <Link
              href="/team"
              className="py-2 px-5 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md me-2 mt-2"
            >
              Ver Todos los Organizadores{" "}
              <MdKeyboardArrowRight className="text-xl ms-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActiveOrganizersSection;
