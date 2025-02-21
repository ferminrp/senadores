"use client"

import { useState, useEffect } from "react"
import VotacionCard from "../components/VotacionCard"
import { getVotaciones } from "../lib/data"

export default function VotacionesClient() {
  const [votaciones, setVotaciones] = useState<any[]>([])

  useEffect(() => {
    const fetchVotaciones = async () => {
      const data = await getVotaciones()
      setVotaciones(data)
    }
    fetchVotaciones()
  }, [])

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Todas las Votaciones del Senado</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {votaciones.map((votacion: any) => (
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
    </main>
  )
}

