'use client';

import { TypeAnimation } from 'react-type-animation';

export const HeroTeam = () => {
  return (
    <section
      className="relative table w-full bg-indigo-600 bg-cover bg-center bg-no-repeat py-36 lg:py-44"
      style={{ backgroundImage: "url('/bg1.png')" }}
    >
      <div className="container relative">
        <div className="mt-10 grid grid-cols-1 pb-8 text-center">
          <h1 className="mb-5 text-4xl font-bold leading-normal text-white lg:text-5xl lg:leading-normal">
            <TypeAnimation
              sequence={[
                'Equipo detrás de la comunidad',
                2000,
                'Lideres',
                2000,
                'Organizadores',
                2000,
                'Facilitadores de la comunidad',
                2000,
                'Voluntarios',
                2000,
                'Mentores',
                2000,
              ]}
              wrapper="span"
              speed={10}
              className="typewrite"
              repeat={Infinity}
            />
          </h1>

          <p className="mx-auto max-w-xl text-lg text-slate-300">
            Nuestros organizadores son el motor que impulsa esta comunidad,
            dedicando su tiempo, energía y creatividad para conectar a los
            amantes de la tecnología en Medellín.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroTeam;
