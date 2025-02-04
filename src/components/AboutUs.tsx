'use client';
import CountUp from 'react-countup';

export default function AboutUs() {
  return (
    <section className="relative pb-16 md:pb-24">
      <div className="container relative">
        <div className="justify-center md:flex">
          <div className="relative -mt-16 md:w-full lg:w-3/4">
            <div className="rounded-md bg-white p-6 shadow dark:bg-slate-900 dark:shadow-gray-800">
              <div className="justify-center md:flex">
                <div className="md:w-1/3">
                  <div className="text-center">
                    <h6 className="mb-0 text-slate-400">Miembros</h6>
                    <h2 className="mb-0 mt-3 text-4xl font-bold">
                      <CountUp
                        className="counter-value"
                        start={102}
                        end={8834}
                      />
                      +
                    </h2>
                  </div>
                </div>

                <div className="mt-8 md:mt-0 md:w-1/3">
                  <div className="text-center">
                    <h6 className="mb-0 text-slate-400">Eventos Realizados</h6>
                    <h2 className="mb-0 mt-3 text-4xl font-bold">
                      <CountUp className="counter-value" start={2} end={450} />+
                    </h2>
                  </div>
                </div>

                <div className="mt-8 md:mt-0 md:w-1/3">
                  <div className="text-center">
                    <h6 className="mb-0 text-slate-400">Años activos</h6>
                    <h2 className="mb-0 mt-3 text-4xl font-bold">
                      <CountUp className="counter-value" start={1} end={12} />
                    </h2>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative mt-16 md:mt-24">
        <div className="grid grid-cols-1 pb-8 text-center">
          <h6 className="mb-2 text-sm font-bold uppercase text-indigo-600">
            Que hacemos
          </h6>
          <h3 className="mb-4 bg-gradient-to-r from-red-600 to-indigo-600 bg-clip-text text-2xl font-semibold leading-normal text-transparent md:text-3xl md:leading-normal">
            Nos encanta Javascript
          </h3>

          <p className="mx-auto max-w-xl text-slate-400">
            Todo el contenido del grupo es propuesto por los miembros de la
            comunidad, si tienes alguna charla, conferencia o experiencia que
            quieras compartir puedes enviar tu propuesta
          </p>
        </div>
      </div>
    </section>
  );
}
