"use client";

import { TypeAnimation } from "react-type-animation";

export const HeroTeam = () => {
  return (
    <section
      className="relative table w-full py-36 lg:py-44 bg-no-repeat bg-center bg-cover bg-indigo-600"
      style={{ backgroundImage: "url('/bg1.png')" }}
    >
      <div className="container relative">
        <div className="grid grid-cols-1 pb-8 text-center mt-10">
          <h1 className="font-bold lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5 text-white">
            <TypeAnimation
              sequence={[
                "Equipo detrás de la comunidad",
                2000,
                "Lideres",
                2000,
                "Organizadores",
                2000,
                "Facilitadores de la comunidad",
                2000,
                "Voluntarios",
                2000,
                "Mentores",
                2000,
              ]}
              wrapper="span"
              speed={10}
              className="typewrite"
              repeat={Infinity}
            />
          </h1>

          <p className="text-slate-300 text-lg max-w-xl mx-auto">
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
