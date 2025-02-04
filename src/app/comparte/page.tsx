"use client";
import { TypeAnimation } from "react-type-animation";

import { Navbar } from "@/components/Navbar";
import Footer from "@/components/Footer";
import { SubmitTalkForm } from "@/components/submitTalk";

export default function SubmitTalk() {
  return (
    <>
      <Navbar navClass="nav-light" />

      <section
        className="relative table w-full py-36 lg:py-44 bg-no-repeat bg-center bg-cover bg-green-600"
        style={{ backgroundImage: "url('/bg3.png')" }}
      >
        <div className="container relative">
          <div className="grid grid-cols-1 pb-8 text-center mt-10">
            <h1 className="font-bold lg:leading-normal leading-normal text-4xl lg:text-5xl mb-5 text-white">
              Inscribe tu
              <TypeAnimation
                sequence={[
                  " Charla",
                  2000,
                  " Taller",
                  2000,
                  " Lightning Talk",
                  2000,
                ]}
                wrapper="span"
                speed={10}
                className="typewrite"
                repeat={Infinity}
              />
            </h1>

            <p className="text-slate-300 text-lg max-w-xl mx-auto">
              ¿Tienes conocimientos que quieres compartir con la comunidad?{" "}
              <br /> ¡Postula tu charla o taller aquí!
            </p>
          </div>
        </div>
      </section>

      <div className="relative">
        <div className="shape absolute sm:-bottom-px -bottom-[2px] start-0 end-0 overflow-hidden z-1 text-white dark:text-slate-900">
          <svg
            className="w-full h-auto scale-[2.0] origin-top"
            viewBox="0 0 2880 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 48H1437.5H2880V0H2160C1442.5 52 720 0 720 0H0V48Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </div>

      <section className="relative md:py-24 py-16">
        <div className="container relative">
          <SubmitTalkForm />
        </div>
      </section>
      <Footer />
    </>
  );
}
