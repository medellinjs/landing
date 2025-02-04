import Link from "next/link";

import {
  FaRegEnvelope,
  FaLinkedin,
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaTiktok,
  FaGithub,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">MedellínJS</h3>
            <p className="text-sm">
              Impulsando la comunidad de desarrolladores JavaScript en Medellín
            </p>
            <ul className="list-none mt-5 space-x-1 space-y-1 ml-0 pl-0">
              <li className="inline">
                <Link
                  href="https://www.instagram.com/medellinjs/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaInstagram className="text-sm" />
                </Link>
              </li>
              <li className="inline">
                <Link
                  href="http://linkedin.com/company/medellinjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaLinkedin className="text-sm" />
                </Link>
              </li>
              <li className="inline">
                <Link
                  href="https://www.facebook.com/medellinjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaFacebookF className="text-sm" />
                </Link>
              </li>
              <li className="inline">
                <Link
                  href="https://twitter.com/medellinjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaTwitter className="text-sm" />
                </Link>
              </li>
              <li className="inline">
                <Link
                  href="https://tiktok.com/medellinjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaTiktok className="text-sm" />
                </Link>
              </li>
              <li className="inline">
                <Link
                  href="https://github.com/medellinjs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaGithub className="text-sm" />
                </Link>
              </li>
              <li className="inline">
                <Link
                  href="mailto:info@medellinjs.org"
                  className="size-8 inline-flex items-center justify-center tracking-wide align-middle duration-500 text-base text-center border border-gray-800 rounded-md hover:border-indigo-600 dark:hover:border-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-600"
                >
                  <FaRegEnvelope className=" text-sm" />
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/comparte" className="text-sm hover:text-blue-400">
                  Inscribe tu charla
                </Link>
              </li>
              <li>
                <Link href="/team" className="text-sm hover:text-blue-400">
                  Organizadores
                </Link>
              </li>
              <li>
                <Link href="/sponsors" className="text-sm hover:text-blue-400">
                  Patrocina
                </Link>
              </li>
              <li>
                <Link
                  href="https://www.meetup.com/es-ES/medellinj"
                  className="text-sm hover:text-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Eventos
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Contacto</h4>
            <p className="text-sm">info@medellinjs.org</p>
            <p className="text-sm">Medellín, Colombia</p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-sm hover:text-blue-400">
                  Términos de Uso
                </Link>
              </li>
              <li>
                <Link href="#" className="text-sm hover:text-blue-400">
                  Política de Privacidad
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} MedellínJS. Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
