import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"

export default function Contact() {
  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Contáctanos</h2>
        <div className="max-w-md mx-auto">
          <form className="space-y-4">
            <Input type="text" placeholder="Nombre" />
            <Input type="email" placeholder="Correo electrónico" />
            <Textarea placeholder="Mensaje" />
            <Button type="submit" className="w-full">
              Enviar Mensaje
            </Button>
          </form>
        </div>
        <div className="mt-12 text-center">
          <h3 className="text-xl font-semibold mb-4">Síguenos en redes sociales</h3>
          <div className="flex justify-center space-x-4">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Twitter
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              LinkedIn
            </a>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

