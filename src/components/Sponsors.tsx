import Link from 'next/link';
import Image from 'next/image';
import { RiMapPinLine } from 'react-icons/ri';

import { FC } from 'react';
import { sponsors } from '@/assets/data';

export type SponsorProps = {
  hideCTA?: boolean;
};

export const Sponsors: FC<SponsorProps> = ({ hideCTA = false }) => {
  return (
    <section
      id="sponsors"
      className="relative bg-gray-50 py-16 dark:bg-slate-800 md:py-24"
    >
      <div className="container relative">
        <h2 className="mb-8 text-center text-3xl font-bold">
          Nuestros Sponsors
        </h2>
        <div className="mb-8 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {sponsors.map((data, index) => {
            return (
              <Link
                href={data.link}
                target="_blank"
                rel="noopener noreferrer"
                key={index}
                className="group rounded border-4 border-white bg-white p-6 text-center shadow duration-500 ease-in-out hover:border-b-indigo-600 hover:shadow-md dark:border-slate-900 dark:bg-slate-900 dark:shadow-gray-800 dark:hover:border-b-indigo-600 dark:hover:shadow-gray-700"
              >
                <Image
                  src={data.image}
                  height={64}
                  width={64}
                  className="mx-auto size-16 rounded-full bg-gray-50 p-3 shadow-md dark:bg-slate-800 dark:shadow-gray-800"
                  alt=""
                />

                <div className="content mt-3">
                  <span className="block text-lg font-semibold transition duration-500 group-hover:text-indigo-600">
                    {data.name}
                  </span>

                  <span className="inline-flex items-center text-base text-slate-400">
                    <RiMapPinLine className="me-1 text-indigo-600" />
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
              className="me-2 mt-2 inline-flex items-center rounded-md border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white duration-500 hover:border-indigo-700 hover:bg-indigo-700"
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
