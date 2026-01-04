import { Button } from './ui/button'

export default function Resources() {
  const resources = [
    { id: 1, title: 'Introducción a ES6', type: 'Video' },
    { id: 2, title: 'React Hooks en Profundidad', type: 'Artículo' },
    { id: 3, title: 'Node.js para Principiantes', type: 'Curso' },
  ]

  return (
    <section id="resources" className="bg-white py-20">
      <div className="container mx-auto px-4">
        <h2 className="mb-8 text-center text-3xl font-bold">Recursos</h2>
        <div className="mb-8 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource) => (
            <div key={resource.id} className="rounded-lg bg-gray-100 p-6">
              <h3 className="mb-2 text-xl font-semibold">{resource.title}</h3>
              <p className="mb-4 text-gray-600">{resource.type}</p>
              <Button variant="outline">Ver Recurso</Button>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Button size="lg">Explorar Recursos</Button>
        </div>
      </div>
    </section>
  )
}
