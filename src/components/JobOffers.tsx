import { Button } from './ui/button'

export default function JobOffers() {
  const jobs = [
    {
      id: 1,
      title: 'Desarrollador Frontend',
      company: 'TechCorp',
      type: 'Tiempo Completo',
    },
    {
      id: 2,
      title: 'Ingeniero Backend Node.js',
      company: 'InnovateMDE',
      type: 'Remoto',
    },
    {
      id: 3,
      title: 'Fullstack JavaScript',
      company: 'DevHub',
      type: 'Contrato',
    },
  ]

  return (
    <section id="jobs" className="bg-gray-100 py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Ofertas Laborales</h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <div key={job.id} className="rounded-lg bg-white p-6 shadow-md">
              <h3 className="mb-2 text-xl font-semibold">{job.title}</h3>
              <p className="mb-4 text-gray-600">
                {job.company} - {job.type}
              </p>
              <Button variant="outline">Ver Detalles</Button>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Button size="lg">Ver Todas las Ofertas</Button>
        </div>
      </div>
    </section>
  )
}
