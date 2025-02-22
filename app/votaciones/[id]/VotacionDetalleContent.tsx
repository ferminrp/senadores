"use client"

import { useState, useEffect } from "react"
import Avatar from "../../components/Avatar"
import { useVotaciones, useSenatorsData } from "../../lib/data"
import { Armchair, CheckCircle2, XCircle, CircleDot, Search } from "lucide-react"
import Skeleton from "../../components/Skeleton"
import { Badge } from "@/components/ui/badge"

export default function VotacionDetalleContent({ id }: { id: string }) {
  const { votaciones, isLoading: isLoadingVotaciones, isError: isErrorVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData, isError: isErrorSenatorsData } = useSenatorsData()
  const [votacion, setVotacion] = useState<any>(null)

  useEffect(() => {
    if (votaciones) {
      const votacionData = votaciones.find((v: any) => v.act_id.toString() === id)
      console.log('Total votes in votacion:', votacionData?.votes?.length)
      setVotacion(votacionData)
    }
  }, [votaciones, id])

  const getBadgeVariant = (result: string) => {
    switch (result) {
      case "AFIRMATIVA":
        return "default"
      case "NEGATIVA":
        return "destructive"
      default:
        return "secondary"
    }
  }

  if (isErrorVotaciones || isErrorSenatorsData) return <div>Error al cargar los datos</div>
  if (isLoadingVotaciones || isLoadingSenatorsData) return <Skeleton className="h-96" />
  if (!votacion) return <div>Votación no encontrada</div>

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Detalle de Votación</h1>
      <div className="bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Moción: {votacion.motion_number || "Sin número"}</h2>
          <Badge variant={getBadgeVariant(votacion.result)} className="text-base">{votacion.result}</Badge>
        </div>
        <p className="text-gray-400 mb-2">Fecha: {votacion.date}</p>
        <p className="text-gray-400 mb-2">Tipo de quórum: {votacion.quorum_type}</p>
        <p className="text-gray-400 mb-4">Mayoría requerida: {votacion.majority_required}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Card de Asistencia */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Asistencia</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: votacion.total_members }).map((_, index) => (
              <Armchair
                key={index}
                size={24}
                className={index < votacion.present ? "text-green-500" : "text-red-500"}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-500">Presentes: {votacion.present}</span>
            <span className="text-red-500">Ausentes: {votacion.absent}</span>
          </div>
        </div>

        {/* Card de Votos */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Resultados de la Votación</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: votacion.affirmative }).map((_, index) => (
              <CheckCircle2 key={`affirmative-${index}`} size={24} className="text-green-500" />
            ))}
            {Array.from({ length: votacion.negative }).map((_, index) => (
              <XCircle key={`negative-${index}`} size={24} className="text-red-500" />
            ))}
            {Array.from({ length: votacion.abstentions }).map((_, index) => (
              <CircleDot key={`abstention-${index}`} size={24} className="text-yellow-500" />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-500">Afirmativos: {votacion.affirmative}</span>
            <span className="text-red-500">Negativos: {votacion.negative}</span>
            <span className="text-yellow-500">Abstenciones: {votacion.abstentions}</span>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Votos individuales</h3>
      <SearchBar votes={votacion.votes} senatorsData={senatorsData} />
    </main>
  )
}

function SearchBar({ votes, senatorsData }: { votes: any[]; senatorsData: any }) {
  const [searchTerm, setSearchTerm] = useState("")
  console.log('Votes received in SearchBar:', votes?.length)

  const filteredVotes = votes.filter((vote) => vote.name.toLowerCase().includes(searchTerm.toLowerCase()))
  console.log('Filtered votes:', filteredVotes?.length)

  return (
    <>
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Buscar senador..."
          className="w-full p-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVotes.map((vote: any) => (
          <div
            key={vote.name}
            className="bg-gray-700 p-4 rounded-lg flex items-start gap-4 transition-all duration-300 hover:bg-gray-600"
          >
            <Avatar name={vote.name} imgUrl={senatorsData[vote.name]} size={48} />
            <div className="min-w-0">
              <p className="font-bold text-sm truncate">{vote.name}</p>
              <p
                className={
                  vote.vote === "SI" ? "text-green-400" : vote.vote === "NO" ? "text-red-400" : "text-yellow-400"
                }
              >
                Voto: {vote.vote}
              </p>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

