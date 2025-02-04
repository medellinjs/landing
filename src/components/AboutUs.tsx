"use client";
import CountUp from "react-countup";

export default function AboutUs() {
  return (
    <section className="relative md:pb-24 pb-16">
      <div className="container relative">
        <div className="md:flex justify-center">
          <div className="lg:w-3/4 md:w-full relative -mt-16">
            <div className="p-6 bg-white dark:bg-slate-900 rounded-md shadow dark:shadow-gray-800">
              <div className="md:flex justify-center">
                <div className="md:w-1/3">
                  <div className="text-center">
                    <h6 className="text-slate-400 mb-0">Miembros</h6>
                    <h2 className="mb-0 text-4xl mt-3 font-bold">
                      <CountUp
                        className="counter-value"
                        start={102}
                        end={8834}
                      />
                      +
                    </h2>
                  </div>
                </div>

                <div className="md:w-1/3 mt-8 md:mt-0">
                  <div className="text-center">
                    <h6 className="text-slate-400 mb-0">Eventos Realizados</h6>
                    <h2 className="mb-0 text-4xl mt-3 font-bold">
                      <CountUp className="counter-value" start={2} end={450} />+
                    </h2>
                  </div>
                </div>

                <div className="md:w-1/3 mt-8 md:mt-0">
                  <div className="text-center">
                    <h6 className="text-slate-400 mb-0">Años activos</h6>
                    <h2 className="mb-0 text-4xl mt-3 font-bold">
                      <CountUp className="counter-value" start={1} end={12} />
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative md:mt-24 mt-16">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h6 className="text-indigo-600 text-sm font-bold uppercase mb-2">
            Que hacemos
          </h6>
          <h3 className="mb-4 md:text-3xl md:leading-normal text-2xl leading-normal font-semibold bg-gradient-to-r from-red-600 to-indigo-600 text-transparent bg-clip-text">
            Nos encanta Javascript
          </h3>

          <p className="text-slate-400 max-w-xl mx-auto">
            Todo el contenido del grupo es propuesto por los miembros de la
            comunidad, si tienes alguna charla, conferencia o experiencia que
            quieras compartir puedes enviar tu propuesta
          </p>
        </div>
      </div>
    </section>
  );
}
