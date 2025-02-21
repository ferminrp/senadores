"use client"
import Hero from "./components/Hero"
import VotacionCard from "./components/VotacionCard"
import { useVotaciones } from "./lib/data"
import Link from "next/link"
import Skeleton from "./components/Skeleton"

export default function HomeContent() {
  const { votaciones, isLoading, isError } = useVotaciones()

  if (isError) return <div>Error al cargar las votaciones</div>

  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8" id="votaciones">
          Últimas Votaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading
            ? Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-48" />)
            : votaciones
                ?.slice(0, 9)
                .map((votacion: any) => (
                  <VotacionCard
                    key={votacion.act_id}
                    id={votacion.act_id}
                    motionNumber={votacion.motion_number}
                    date={votacion.date}
                    affirmative={votacion.affirmative}
                    negative={votacion.negative}
                    abstentions={votacion.abstentions}
                  />
                ))}
        </div>
        <div className="text-center mt-12">
          <Link
            href="/votaciones"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full transition duration-300"
          >
            Ver todas las votaciones
          </Link>
        </div>
      </div>
    </main>
  )
}

