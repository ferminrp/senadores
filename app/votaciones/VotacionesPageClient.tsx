"use client"

import VotacionCard from "../components/VotacionCard"
import VotacionFilter from "../components/VotacionFilter"
import { useVotaciones } from "../lib/data"
import { Skeleton } from "@/components/ui/skeleton"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle } from "lucide-react"

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
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-red-900/20 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">No pudimos cargar las votaciones</h1>
          <p className="text-gray-400 max-w-md mb-8">
            Hubo un problema al cargar las votaciones del Senado. Esto puede deberse a problemas de conexión o mantenimiento del servidor.
          </p>
          <Button 
            onClick={() => window.location.reload()}
            variant="secondary"
            size="lg"
            className="font-medium"
          >
            Intentar nuevamente
          </Button>
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
    : votaciones.filter((votacion) => votacion.resultado.toUpperCase() === selectedResult)

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
            resultado={votacion.resultado}
          />
        ))}
      </div>
    </main>
  )
}

