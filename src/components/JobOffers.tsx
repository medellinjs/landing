import { Button } from "./ui/button"

export default function JobOffers() {
  const jobs = [
    { id: 1, title: "Desarrollador Frontend", company: "TechCorp", type: "Tiempo Completo" },
    { id: 2, title: "Ingeniero Backend Node.js", company: "InnovateMDE", type: "Remoto" },
    { id: 3, title: "Fullstack JavaScript", company: "DevHub", type: "Contrato" },
  ]

  return (
    <section id="jobs" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Ofertas Laborales</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-2">{job.title}</h3>
              <p className="text-gray-600 mb-4">
                {job.company} - {job.type}
              </p>
              <Button variant="outline">Ver Detalles</Button>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Button size="lg">Ver Todas las Ofertas</Button>
        </div>
      </div>
    </section>
  )
}

