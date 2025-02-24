"use client"

import Hero from "./components/Hero"
import VotacionCard from "./components/VotacionCard"
import { useVotaciones } from "./lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomeClient() {
  const { votaciones, isLoading, isError } = useVotaciones()

  if (isError) return (
    <div className="text-red-600 dark:text-red-400 container mx-auto px-4 py-12">
      Error al cargar las votaciones
    </div>
  )

  return (
    <main className="min-h-screen bg-white dark:bg-gray-900">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8 text-gray-900 dark:text-gray-100" id="votaciones">
          Últimas Votaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-48" />)
            : votaciones?.slice(0, 9).map((votacion: any) => (
                <VotacionCard
                  key={votacion.actaId}
                  id={votacion.actaId.toString()}
                  proyecto={votacion.proyecto}
                  titulo={votacion.titulo}
                  fecha={votacion.fecha}
                  afirmativos={votacion.afirmativos}
                  negativos={votacion.negativos}
                  abstenciones={votacion.abstenciones}
                  resultado={votacion.resultado}
                />
              ))}
        </div>
        <div className="text-center mt-12">
          <a
            href="/votaciones"
            className="inline-flex items-center px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition duration-300"
          >
            Ver todas las votaciones
          </a>
        </div>
      </div>
    </main>
  )
}

