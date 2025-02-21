"use client"

import { useState, useEffect } from "react"
import Hero from "./components/Hero"
import VotacionCard from "./components/VotacionCard"
import { getVotaciones } from "./lib/data"

export default function HomeClient() {
  const [votaciones, setVotaciones] = useState<any[]>([])

  useEffect(() => {
    const fetchVotaciones = async () => {
      const data = await getVotaciones()
      setVotaciones(data)
    }
    fetchVotaciones()
  }, [])

  return (
    <main className="min-h-screen">
      <Hero />
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold mb-8" id="votaciones">
          Últimas Votaciones
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {votaciones.slice(0, 9).map((votacion: any) => (
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
          <a
            href="/votaciones"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            Ver todas las votaciones
          </a>
        </div>
      </div>
    </main>
  )
}

