"use client"

import VotacionCard from "../components/VotacionCard"
import { useVotaciones } from "../lib/data"
import { Skeleton } from "@/components/ui/skeleton"

export default function VotacionesPage() {
  const { votaciones, isLoading, isError } = useVotaciones()

  if (isError) return <div>Error al cargar las votaciones</div>

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Todas las Votaciones del Senado</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 9 }).map((_, index) => <Skeleton key={index} className="h-48" />)
          : votaciones?.map((votacion: any) => (
              <VotacionCard
                key={votacion.act_id}
                id={votacion.act_id}
                motionNumber={votacion.motion_number}
                date={votacion.date}
                affirmative={votacion.affirmative}
                negative={votacion.negative}
                abstentions={votacion.abstentions}
                result={votacion.result}
              />
            ))}
      </div>
    </main>
  )
}

