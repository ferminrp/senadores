"use client"

import VotacionCard from "../components/VotacionCard"
import VotacionFilter from "../components/VotacionFilter"
import { useVotaciones } from "../lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"

export default function VotacionesPageClient() {
  const { votaciones, isLoading, isError } = useVotaciones()
  const [selectedResult, setSelectedResult] = useState("TODOS")

  if (isLoading) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Todas las Votaciones del Senado</h1>
        <VotacionFilter
          selectedResult={selectedResult}
          onResultChange={setSelectedResult}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 12 }).map((_, index) => (
            <div key={index} className="h-64 bg-gray-800 rounded-lg animate-pulse" />
          ))}
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Error</h1>
          <p className="text-gray-400">No se pudieron cargar las votaciones</p>
        </div>
      </main>
    )
  }

  if (!votaciones || votaciones.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Sin Votaciones</h1>
          <p className="text-gray-400">No hay votaciones disponibles</p>
        </div>
      </main>
    )
  }

  const filteredVotaciones = selectedResult === "TODOS"
    ? votaciones
    : votaciones.filter((votacion) => votacion.resultado === selectedResult)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Todas las Votaciones del Senado</h1>
      <VotacionFilter
        selectedResult={selectedResult}
        onResultChange={setSelectedResult}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVotaciones.map((votacion) => (
          <VotacionCard
            key={votacion.actaId}
            id={votacion.actaId.toString()}
            proyecto={votacion.proyecto}
            titulo={votacion.titulo}
            fecha={votacion.fecha}
            afirmativos={Number(votacion.afirmativos)}
            negativos={Number(votacion.negativos)}
            abstenciones={Number(votacion.abstenciones)}
          />
        ))}
      </div>
    </main>
  )
}

