import Link from "next/link";
import Image from "next/image";
import { RiMapPinLine } from "react-icons/ri";

import { FC } from "react";
import { sponsors } from "@/assets/data";

export type SponsorProps = {
  hideCTA?: boolean;
};

export const Sponsors: FC<SponsorProps> = ({ hideCTA = false }) => {
  return (
    <section
      id="sponsors"
      className="relative md:py-24 py-16 bg-gray-50 dark:bg-slate-800"
    >
      <div className="container relative">
        <h2 className="text-3xl font-bold text-center mb-8">
          Nuestros Sponsors
        </h2>
        <div className="grid lg:grid-cols-4 md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 mb-8">
          {sponsors.map((data, index) => {
            return (
              <Link
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="group bg-white dark:bg-slate-900 p-6 rounded shadow dark:shadow-gray-800 hover:shadow-md dark:hover:shadow-gray-700 border-4 border-white dark:border-slate-900 hover:border-b-indigo-600 dark:hover:border-b-indigo-600 text-center duration-500 ease-in-out"
              >
                <Image
                  src={data.image}
                  height={64}
                  width={64}
                  className="size-16 mx-auto p-3 rounded-full bg-gray-50 dark:bg-slate-800 shadow-md dark:shadow-gray-800"
                  alt=""
                />

                <div className="content mt-3">
                  <span className="text-lg font-semibold group-hover:text-indigo-600 transition duration-500 block">
                    {data.name}
                  </span>

                  <span className="text-base text-slate-400 inline-flex items-center">
                    <RiMapPinLine className="text-indigo-600 me-1" />
                    {data.location}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
        {hideCTA ? null : (
          <div className="text-center">
            <Link
              href="/sponsors"
              className="py-2 px-5 inline-flex items-center font-semibold tracking-wide border align-middle duration-500 text-base text-center bg-indigo-600 hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 text-white rounded-md me-2 mt-2"
            >
              Conviértete en Sponsor
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default Sponsors;
