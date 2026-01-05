import Link from 'next/link'
import Image from 'next/image'

import { communityTestimonials } from '@assets/data'

export default function Community() {
  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      <div className="container relative">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h3 className="mb-6 text-2xl font-semibold leading-normal md:text-3xl md:leading-normal">
            Nuestra Comunidad
          </h3>
          <p className="mx-auto max-w-xl text-slate-400">
            En MedellínJS, nuestra comunidad es el corazón de todo lo que hacemos. Aquí,
            desarrolladores, entusiastas y expertos en tecnología se reúnen para compartir
            conocimientos, inspirarse y crecer juntos.
          </p>
        </div>
      </div>
      <div className="container-fluid relative">
        <div className="mt-8 grid grid-cols-1">
          <div className="slider relative m-auto mb-4 overflow-hidden before:absolute before:start-0 before:top-0 before:z-2 before:content-[''] after:absolute after:end-0 after:top-0 after:z-2 after:content-['']">
            <div className="slide-track flex items-center">
              {communityTestimonials.map((item, index) => {
                return (
                  <div className="slide m-2 h-auto w-72 md:w-[360px]" key={index}>
                    <ul className="space-y-4">
                      <li className="rounded-lg p-6 shadow dark:shadow-gray-800">
                        <div className="flex items-center border-b border-gray-100 pb-6 dark:border-gray-800">
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
                              className="text-lg duration-500 ease-in-out hover:text-indigo-600"
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

                      <li className="rounded-lg p-6 shadow dark:shadow-gray-800">
                        <div className="flex items-center border-b border-gray-100 pb-6 dark:border-gray-800">
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
                              className="text-lg duration-500 ease-in-out hover:text-indigo-600"
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
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
