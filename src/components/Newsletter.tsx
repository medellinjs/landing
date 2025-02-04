import { Button } from './ui/button';
import { Input } from './ui/input';

export default function Newsletter() {
  return (
    <section className="relative table w-full bg-indigo-600 py-36">
      <div
        className="absolute inset-0 bg-cover bg-bottom bg-no-repeat"
        style={{ backgroundImage: "url('/cta.png')" }}
      ></div>
      <div className="container relative">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          <div className="mt-8 lg:mt-0">
            <div className="text-center lg:me-6 lg:text-start">
              <h3 className="mb-4 text-3xl font-semibold leading-normal text-white md:text-4xl lg:leading-normal">
                Suscríbete a Nuestro Newsletter
              </h3>

              <p className="mx-auto max-w-xl text-white/80 lg:ms-auto">
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
              className="h-[50px] w-full rounded-full bg-white pb-4 pe-40 ps-6 pt-4 text-black shadow outline-none dark:bg-slate-900 dark:text-white dark:shadow-gray-800"
              placeholder="Tu correo electrónico:"
            />
            <Button
              type="submit"
              className="absolute end-[3px] top-[2px] inline-block h-[46px] rounded-full border border-indigo-600 bg-indigo-600 px-5 py-2 text-center align-middle text-base font-semibold tracking-wide text-white transition duration-500 ease-in-out hover:border-indigo-700 hover:bg-indigo-700"
            >
              Suscribirse
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}
