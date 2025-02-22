"use client"

import { useState, useEffect } from "react"
import Avatar from "../../components/Avatar"
import { useVotaciones, useSenatorsData } from "../../lib/data"
import { Armchair, CheckCircle2, XCircle, CircleDot, Search } from "lucide-react"
import Skeleton from "../../components/Skeleton"
import { Badge } from "@/components/ui/badge"

interface Senator {
  name: string;
  img: string;
  party: string;
  wikipedia_url: string;
  province: string;
  email: string;
  telefono: string | null;
  twitter: string;
  instagram: string;
}

export default function VotacionDetalleContent({ id }: { id: string }) {
  const { votaciones, isLoading: isLoadingVotaciones, isError: isErrorVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData, isError: isErrorSenatorsData } = useSenatorsData()
  const [votacion, setVotacion] = useState<any>(null)

  useEffect(() => {
    if (votaciones) {
      const votacionData = votaciones.find((v: any) => v.actaId.toString() === id)
      console.log('Total votes in votacion:', votacionData?.votos?.length)
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
          <h2 className="text-2xl font-bold">{votacion.titulo || "Sin título"}</h2>
          <Badge variant={getBadgeVariant(votacion.resultado)} className="text-base">{votacion.resultado}</Badge>
        </div>
        <p className="text-gray-400 mb-2">Fecha: {votacion.fecha}</p>
        <p className="text-gray-400 mb-2">Descripción: {votacion.descripcion}</p>
        <p className="text-gray-400 mb-2">Tipo de quórum: {votacion.quorumTipo}</p>
        <p className="text-gray-400 mb-4">Mayoría requerida: {votacion.mayoria}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Card de Asistencia */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Asistencia</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: votacion.miembros }).map((_, index) => (
              <Armchair
                key={index}
                size={24}
                className={index < votacion.presentes ? "text-green-500" : "text-red-500"}
              />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-500">Presentes: {votacion.presentes}</span>
            <span className="text-red-500">Ausentes: {votacion.ausentes}</span>
          </div>
        </div>

        {/* Card de Votos */}
        <div className="bg-gray-800 rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold mb-4">Resultados de la Votación</h3>
          <div className="flex flex-wrap gap-2">
            {Array.from({ length: votacion.afirmativos }).map((_, index) => (
              <CheckCircle2 key={`affirmative-${index}`} size={24} className="text-green-500" />
            ))}
            {Array.from({ length: votacion.negativos }).map((_, index) => (
              <XCircle key={`negative-${index}`} size={24} className="text-red-500" />
            ))}
            {Array.from({ length: votacion.abstenciones }).map((_, index) => (
              <CircleDot key={`abstention-${index}`} size={24} className="text-yellow-500" />
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-green-500">Afirmativos: {votacion.afirmativos}</span>
            <span className="text-red-500">Negativos: {votacion.negativos}</span>
            <span className="text-yellow-500">Abstenciones: {votacion.abstenciones}</span>
          </div>
        </div>
      </div>

      <h3 className="text-2xl font-bold mb-4">Votos individuales</h3>
      <SearchBar votes={votacion.votos} senatorsData={senatorsData} />
    </main>
  )
}

function SearchBar({ votes, senatorsData }: { votes: any[]; senatorsData: any }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedVote, setSelectedVote] = useState<string>("TODOS")
  const [selectedParty, setSelectedParty] = useState<string>("TODOS")

  // Get unique parties from senatorsData
  const uniqueParties = Array.from(new Set(senatorsData.map((senator: Senator) => senator.party))).sort() as string[]

  const filteredVotes = votes.filter((vote) => {
    const matchesSearch = vote.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesVote = selectedVote === "TODOS" || vote.voto === selectedVote
    const senatorParty = senatorsData.find((senator: Senator) => senator.name === vote.nombre)?.party
    const matchesParty = selectedParty === "TODOS" || senatorParty === selectedParty
    return matchesSearch && matchesVote && matchesParty
  })

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <input
            type="text"
            placeholder="Buscar senador..."
            className="w-full p-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        
        <select
          className="p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedVote}
          onChange={(e) => setSelectedVote(e.target.value)}
        >
          <option value="TODOS">Todos los votos</option>
          <option value="SI">Afirmativo</option>
          <option value="NO">Negativo</option>
          <option value="ABSTENCION">Abstención</option>
          <option value="AUSENTE">Ausente</option>
        </select>

        <select
          className="p-2 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedParty}
          onChange={(e) => setSelectedParty(e.target.value)}
        >
          <option value="TODOS">Todos los partidos</option>
          {uniqueParties.map((party) => (
            <option key={party} value={party}>{party}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVotes.length > 0 ? (
          filteredVotes.map((vote: any) => (
            <div
              key={vote.nombre}
              className="bg-gray-700 p-4 rounded-lg flex items-start gap-4 transition-all duration-300 hover:bg-gray-600"
            >
              <Avatar 
                name={vote.nombre} 
                imgUrl={senatorsData.find((senator: Senator) => senator.name === vote.nombre)?.img} 
                size={48} 
              />
              <div className="min-w-0">
                <p className="font-bold text-sm truncate">{vote.nombre}</p>
                <p className="text-gray-400 text-xs truncate">
                  {senatorsData.find((senator: Senator) => senator.name === vote.nombre)?.party}
                </p>
                <p
                  className={
                    vote.voto.toLowerCase() === "si" ? "text-green-400" : vote.voto.toLowerCase() === "no" ? "text-red-400" : "text-yellow-400"
                  }
                >
                  Voto: {vote.voto}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-700 rounded-lg">
            <Search className="text-gray-400 mb-4" size={48} />
            <h3 className="text-xl font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-400 text-center">
              No hay votos que coincidan con los filtros seleccionados. 
              Intenta ajustar los criterios de búsqueda.
            </p>
          </div>
        )}
      </div>
    </>
  )
}

