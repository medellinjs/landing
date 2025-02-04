import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function Newsletter() {
  return (
    <section className="py-36 w-full table relative bg-indigo-600">
      <div
        className="absolute inset-0 bg-bottom bg-no-repeat bg-cover"
        style={{ backgroundImage: "url('/cta.png')" }}
      ></div>
      <div className="container relative">
        <div className="grid lg:grid-cols-2 grid-cols-1 items-center gap-8">
          <div className="lg:mt-0 mt-8">
            <div className="lg:me-6 text-center lg:text-start">
              <h3 className="mb-4 md:text-4xl text-3xl lg:leading-normal leading-normal text-white font-semibold">
                Suscríbete a Nuestro Newsletter
              </h3>

              <p className="text-white/80 max-w-xl mx-auto lg:ms-auto">
                Recibe actualizaciones sobre eventos, recursos y oportunidades
                exclusivas.
              </p>
            </div>
          </div>

          <form className="relative max-w-xl">
            <Input
              type="email"
              id="subcribe"
              name="email"
              className="pt-4 pe-40 pb-4 ps-6 w-full h-[50px] outline-none text-black dark:text-white rounded-full bg-white dark:bg-slate-900 shadow dark:shadow-gray-800"
              placeholder="Tu correo electrónico:"
            />
            <Button
              type="submit"
              className="py-2 px-5 inline-block font-semibold tracking-wide align-middle transition duration-500 ease-in-out text-base text-center absolute top-[2px] end-[3px] h-[46px] bg-indigo-600 hover:bg-indigo-700 border border-indigo-600 hover:border-indigo-700 text-white rounded-full"
            >
              Suscribirse
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
