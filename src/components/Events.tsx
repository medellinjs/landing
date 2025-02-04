"use client";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Clock, MapPin } from "lucide-react";

export default function Events() {
  const nextEvent = {
    title: `LLM apps 101 para <br /> Javascript Developers`,
    date: "08 de Febrero, 2025",
    time: "09:00 - 11:00",
    location: "UPB - Universidad Pontifície Bolivariana",
    description:
      "¿Quieres crear aplicaciones con inteligencia artificial? En este workshop de 2 horas, aprenderás los fundamentos para desarrollar tus primeras apps con Large Language Models (LLMs) usando JavaScript. ¡Manos a la obra!",
    speaker: "Ana Martínez",
    speakerRole: "Senior Frontend Developer @ TechCorp",
  };

  return (
    <section className="relative md:py-24 py-16 md:pt-0 pt-0 bg-white">
      <div className="container relative">
        <div className="grid grid-cols-1 justify-center">
          <div className="relative z-1">
            <div className="grid lg:grid-cols-12 grid-cols-1 md:text-start text-center justify-center">
              <div className="lg:col-start-2 lg:col-span-10">
                <div className="relative">
                  <Image
                    src="/event-1.webp"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: "auto" }}
                    className="rounded-md shadow-lg"
                    alt="Event cover"
                  />
                </div>
              </div>
            </div>
            <div className="content md:mt-8">
              <div className="grid lg:grid-cols-12 grid-cols-1 md:text-start text-center justify-center">
                <div className="lg:col-start-2 lg:col-span-10">
                  <div className="text-center justify-center">
                    <div className="flex justify-between ">
                      <div className="flex items-center mb-2">
                        <Calendar className="mr-2 text-white" />
                        <span className="leading-normal font-semibold text-white">
                          {nextEvent.date}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <Clock className="mr-2 text-white" />
                        <span className="leading-normal font-semibold text-white">
                          {nextEvent.time}
                        </span>
                      </div>
                      <div className="flex items-center mb-2">
                        <MapPin className="mr-2 text-white" />
                        <span className="leading-normal font-semibold text-white">
                          {nextEvent.location}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 grid-cols-1 items-center">
                    <div className="mt-8">
                      <div className="section-title text-md-start">
                        <h6 className="text-white/50 text-lg font-semibold">
                          Workshop
                        </h6>
                        <h3 className="md:text-3xl text-2xl md:leading-normal leading-normal font-semibold text-white mt-2">
                          LLM apps 101 para <br /> Javascript Developers
                        </h3>
                      </div>
                    </div>

                    <div className="mt-8">
                      <div className="section-title text-md-start">
                        <p className="text-white/50 max-w-xl mx-auto mb-2">
                          {nextEvent.description}
                        </p>
                        <Link
                          href="https://www.meetup.com/es-ES/medellinjs/events/305920128/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-white flex"
                        >
                          Más información{" "}
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

      <div className="absolute bottom-0 start-0 end-0 sm:h-2/3 h-4/5 bg-gradient-to-b from-indigo-500 to-indigo-600"></div>
    </section>
  );
}
