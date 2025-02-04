"use client";
import Image from "next/image";

import { sponsorTestimonials } from "@assets/data";

export const SponsorQuotes = () => {
  return (
    <div className="container relative md:mt-24 mt-16">
      <div className="grid grid-cols-1 pb-8 text-center">
        <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
          Lo que dicen nuestros patrocinadores
        </h3>

        <p className="text-slate-400 max-w-xl mx-auto">
          Aquí compartimos las experiencias y testimonios de nuestros
          patrocinadores sobre cómo ser parte de nuestra comunidad ha impactado
          positivamente sus marcas y les ha permitido conectarse con talento
          excepcional
        </p>
      </div>

      <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 mt-8 gap-[30px]">
        {sponsorTestimonials.map((item, index) => {
          return (
            <ul className="space-y-8" key={index}>
              <li className="shadow dark:shadow-gray-800 p-6">
                <div className="flex items-center pb-6 border-b border-gray-100 dark:border-gray-800">
                  <Image
                    src={item.image}
                    width={64}
                    height={64}
                    className="size-16 rounded-full shadow dark:shadow-gray-800"
                    alt=""
                  />

                  <div className="ps-4">
                    <h6 className="text-lg hover:text-indigo-600 duration-500 ease-in-out">
                      {item.name}
                    </h6>
                    <p className="text-slate-400">{item.company}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <p className="text-slate-400">{item.description}</p>
                </div>
              </li>

              <li className="shadow dark:shadow-gray-800 p-6">
                <div className="flex items-center pb-6 border-b border-gray-100 dark:border-gray-800">
                  <Image
                    src={item.image1}
                    width={64}
                    height={64}
                    className="size-16 rounded-full shadow dark:shadow-gray-800"
                    alt=""
                  />

                  <div className="ps-4">
                    <h6 className="text-lg hover:text-indigo-600 duration-500 ease-in-out">
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
