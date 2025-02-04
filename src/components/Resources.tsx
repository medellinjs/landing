import { Button } from "./ui/button"

export default function Resources() {
  const resources = [
    { id: 1, title: "Introducción a ES6", type: "Video" },
    { id: 2, title: "React Hooks en Profundidad", type: "Artículo" },
    { id: 3, title: "Node.js para Principiantes", type: "Curso" },
  ]

  return (
    <section id="resources" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Recursos</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {resources.map((resource) => (
            <div key={resource.id} className="bg-gray-100 rounded-lg p-6">
              <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
              <p className="text-gray-600 mb-4">{resource.type}</p>
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

