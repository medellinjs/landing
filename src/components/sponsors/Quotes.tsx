'use client';
import Image from 'next/image';

import { sponsorTestimonials } from '@assets/data';

export const SponsorQuotes = () => {
  return (
    <div className="container relative mt-16 md:mt-24">
      <div className="grid grid-cols-1 pb-8 text-center">
        <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
          Lo que dicen nuestros patrocinadores
        </h3>

        <p className="mx-auto max-w-xl text-slate-400">
          Aquí compartimos las experiencias y testimonios de nuestros
          patrocinadores sobre cómo ser parte de nuestra comunidad ha impactado
          positivamente sus marcas y les ha permitido conectarse con talento
          excepcional
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-[30px] sm:grid-cols-2 lg:grid-cols-3">
        {sponsorTestimonials.map((item, index) => {
          return (
            <ul className="space-y-8" key={index}>
              <li className="p-6 shadow dark:shadow-gray-800">
                <div className="flex items-center border-b border-gray-100 pb-6 dark:border-gray-800">
                  <Image
                    src={item.image}
                    width={64}
                    height={64}
                    className="size-16 rounded-full shadow dark:shadow-gray-800"
                    alt=""
                  />

                  <div className="ps-4">
                    <h6 className="text-lg duration-500 ease-in-out hover:text-indigo-600">
                      {item.name}
                    </h6>
                    <p className="text-slate-400">{item.company}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </li>

              <li className="p-6 shadow dark:shadow-gray-800">
                <div className="flex items-center border-b border-gray-100 pb-6 dark:border-gray-800">
                  <Image
                    src={item.image1}
                    width={64}
                    height={64}
                    className="size-16 rounded-full shadow dark:shadow-gray-800"
                    alt=""
                  />

                  <div className="ps-4">
                    <h6 className="text-lg duration-500 ease-in-out hover:text-indigo-600">
                      {item.name1}
                    </h6>
                    <p className="text-slate-400">{item.company1}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-slate-400">{item.description1}</p>
                </div>
              </li>
            </ul>
          );
        })}
      </div>
    </div>
  );
};

export default SponsorQuotes;
