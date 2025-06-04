'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin } from 'lucide-react';

export default function Events() {
  const nextEvent = {
    title: `Construye tu primer agente con LangGraph`,
    date: '14 de Junio, 2025',
    time: '09:00 - 11:30',
    location: 'UPB Campus Laureles',
    description:
      'En este taller practico vamos a usar una de las plantillas de LangGraph para construir nuestro primer agente AI investigador.',
    speaker: 'Wbert Adrian',
    speakerRole: 'FullStack Developer',
  };

  return (
    <section className="relative bg-white py-16 pt-0 md:py-24 md:pt-0">
      <div className="container relative">
        <div className="grid grid-cols-1 justify-center">
          <div className="relative z-1">
            <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
              <div className="lg:col-span-10 lg:col-start-2">
                <div className="relative">
                  <Image
                    src="/event-1.webp"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: '100%', height: 'auto' }}
                    className="rounded-md shadow-lg"
                    alt="Event cover"
                  />
                </div>
              </div>
            </div>
            <div className="content md:mt-8">
              <div className="grid grid-cols-1 justify-center text-center md:text-start lg:grid-cols-12">
                <div className="lg:col-span-10 lg:col-start-2">
                  <div className="justify-center text-center">
                    <div className="flex justify-between">
                      <div className="mb-2 flex items-center">
                        <Calendar className="mr-2 text-white" />
                        <span className="font-semibold leading-normal text-white">
                          {nextEvent.date}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center">
                        <Clock className="mr-2 text-white" />
                        <span className="font-semibold leading-normal text-white">
                          {nextEvent.time}
                        </span>
                      </div>
                      <div className="mb-2 flex items-center">
                        <MapPin className="mr-2 text-white" />
                        <span className="font-semibold leading-normal text-white">
                          {nextEvent.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 items-center md:grid-cols-2">
                    <div className="mt-8">
                      <div className="section-title text-md-start">
                        <h6 className="text-lg font-semibold text-white/50">
                          Charla
                        </h6>
                        <h3 className="mt-2 text-2xl font-semibold leading-normal text-white md:text-3xl md:leading-normal">
                          JavaScript a Prueba de Balas: <br /> Transforma tu
                          Código con Estrategias de Testing
                        </h3>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="section-title text-md-start">
                        <p className="mx-auto mb-2 max-w-xl text-white/50">
                          {nextEvent.description}
                        </p>
                        <Link
                          href="https://www.meetup.com/medellinjs/events/308229554"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex text-white"
                        >
                          Más información{' '}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 end-0 start-0 h-4/5 bg-gradient-to-b from-indigo-500 to-indigo-600 sm:h-2/3"></div>
    </section>
  );
}
