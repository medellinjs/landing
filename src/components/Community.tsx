import Link from "next/link";
import Image from "next/image";

import { communityTestimonials } from "@assets/data";

export default function Community() {
  return (
    <section className="relative md:py-24 py-16 overflow-hidden">
      <div className="container relative">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h3 className="mb-6 md:text-3xl text-2xl md:leading-normal leading-normal font-semibold">
            Nuestra Comunidad
          </h3>
          <p className="text-slate-400 max-w-xl mx-auto">
            En MedellínJS, nuestra comunidad es el corazón de todo lo que
            hacemos. Aquí, desarrolladores, entusiastas y expertos en tecnología
            se reúnen para compartir conocimientos, inspirarse y crecer juntos.
          </p>
        </div>
      </div>
      <div className="container-fluid relative">
        <div className="grid grid-cols-1 mt-8">
          <div className="slider relative overflow-hidden m-auto mb-4 before:content-[''] before:absolute before:top-0 before:start-0 before:z-2 after:content-[''] after:absolute after:top-0 after:end-0 after:z-2">
            <div className="slide-track flex items-center">
              {communityTestimonials.map((item, index) => {
                return (
                  <div
                    className="slide h-auto md:w-[360px] w-72 m-2"
                    key={index}
                  >
                    <ul className="space-y-4">
                      <li className="rounded-lg shadow dark:shadow-gray-800 p-6">
                        <div className="flex items-center pb-6 border-b border-gray-100 dark:border-gray-800">
                          <Image
                            src={item.image}
                            width={64}
                            height={64}
                            className="size-16 rounded-full shadow dark:shadow-gray-800"
                            alt=""
                          />

                          <div className="ps-4">
                            <Link
                              href="#"
                              className="text-lg hover:text-indigo-600 duration-500 ease-in-out"
                            >
                              {item.name}
                            </Link>
                            <p className="text-slate-400">{item.title}</p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <p className="text-slate-400">{item.des}</p>
                        </div>
                      </li>

                      <li className="rounded-lg shadow dark:shadow-gray-800 p-6">
                        <div className="flex items-center pb-6 border-b border-gray-100 dark:border-gray-800">
                          <Image
                            src={item.image2}
                            width={64}
                            height={64}
                            className="size-16 rounded-full shadow dark:shadow-gray-800"
                            alt=""
                          />

                          <div className="ps-4">
                            <Link
                              href="#"
                              className="text-lg hover:text-indigo-600 duration-500 ease-in-out"
                            >
                              {item.name2}
                            </Link>
                            <p className="text-slate-400">{item.title2}</p>
                          </div>
                        </div>

                        <div className="mt-6">
                          <p className="text-slate-400">{item.des2}</p>
                        </div>
                      </li>
                    </ul>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
