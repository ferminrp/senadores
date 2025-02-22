"use client"

import { useState, useEffect } from "react"
import Avatar from "../../components/Avatar"
import { useVotaciones, useSenatorsData } from "../../lib/data"
import { Armchair, CheckCircle2, XCircle, CircleDot, Search } from "lucide-react"
import Skeleton from "../../components/Skeleton"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

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
    switch (result.toUpperCase()) {
      case "AFIRMATIVA":
        return "default"
      case "NEGATIVA":
        return "destructive"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-AR', options);
  }

  if (isErrorVotaciones || isErrorSenatorsData) return <div>Error al cargar los datos</div>
  if (isLoadingVotaciones || isLoadingSenatorsData) return <Skeleton className="h-96" />
  if (!votacion) return <div>Votación no encontrada</div>

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <h1 className="text-3xl font-bold leading-tight">{votacion.titulo || "Sin título"}</h1>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <div className="flex items-center text-gray-300">
                  <span className="block text-gray-400">{formatDate(votacion.fecha)}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="block font-medium mr-2">Quórum:</span>
                  <span className="block">{votacion.quorumTipo}</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <span className="block font-medium mr-2">Mayoría:</span>
                  <span className="block">{votacion.mayoria}</span>
                </div>
              </div>
              {votacion.descripcion && (
                <p className="text-gray-400 text-sm leading-relaxed">{votacion.descripcion}</p>
              )}
            </div>
            <Badge 
              variant={getBadgeVariant(votacion.resultado)} 
              className="text-base px-6 py-1.5 h-9 capitalize rounded-full font-medium shadow-lg"
            >
              {votacion.resultado}
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Card de Asistencia */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-100">Asistencia</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <span className="block text-3xl font-bold text-green-400 mb-1">{votacion.presentes}</span>
                  <span className="text-sm text-gray-400 font-medium">Presentes</span>
                </div>
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <span className="block text-3xl font-bold text-red-400 mb-1">{votacion.ausentes}</span>
                  <span className="text-sm text-gray-400 font-medium">Ausentes</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {Array.from({ length: votacion.miembros }).map((_, index) => (
                  <Armchair
                    key={index}
                    size={16}
                    className={index < votacion.presentes ? "text-green-400" : "text-red-400/50"}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Card de Votos */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-700/50">
              <h3 className="text-xl font-semibold text-gray-100">Resultados</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <span className="block text-3xl font-bold text-green-400 mb-1">{votacion.afirmativos}</span>
                  <span className="text-sm text-gray-400 font-medium">Afirmativos</span>
                </div>
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <span className="block text-3xl font-bold text-red-400 mb-1">{votacion.negativos}</span>
                  <span className="text-sm text-gray-400 font-medium">Negativos</span>
                </div>
                <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-6 text-center">
                  <span className="block text-3xl font-bold text-yellow-400 mb-1">{votacion.abstenciones}</span>
                  <span className="text-sm text-gray-400 font-medium">Abstenciones</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-1.5 justify-center">
                {Array.from({ length: votacion.afirmativos }).map((_, index) => (
                  <CheckCircle2 key={`affirmative-${index}`} size={16} className="text-green-400" />
                ))}
                {Array.from({ length: votacion.negativos }).map((_, index) => (
                  <XCircle key={`negative-${index}`} size={16} className="text-red-400" />
                ))}
                {Array.from({ length: votacion.abstenciones }).map((_, index) => (
                  <CircleDot key={`abstention-${index}`} size={16} className="text-yellow-400/80" />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-xl p-8">
          <h3 className="text-xl font-semibold text-gray-100 mb-6">Votos individuales</h3>
          <SearchBar votes={votacion.votos} senatorsData={senatorsData} />
        </div>
      </div>
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
    const matchesVote = selectedVote === "TODOS" || vote.voto.toLowerCase() === selectedVote.toLowerCase()
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
            className="w-full px-4 py-3 pl-11 bg-gray-900/30 backdrop-blur-sm text-white rounded-xl border border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500/40"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-3.5 text-gray-400" size={18} />
        </div>
        
        <Select defaultValue="TODOS" value={selectedVote} onValueChange={setSelectedVote}>
          <SelectTrigger className="w-full md:w-[200px] bg-gray-900/30 border-gray-700/50 rounded-xl">
            <SelectValue placeholder="Todos los votos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los votos</SelectItem>
            <SelectItem value="si">Afirmativo</SelectItem>
            <SelectItem value="no">Negativo</SelectItem>
            <SelectItem value="abstencion">Abstención</SelectItem>
            <SelectItem value="ausente">Ausente</SelectItem>
          </SelectContent>
        </Select>

        <Select defaultValue="TODOS" value={selectedParty} onValueChange={setSelectedParty}>
          <SelectTrigger className="w-full md:w-[200px] bg-gray-900/30 border-gray-700/50 rounded-xl">
            <SelectValue placeholder="Todos los partidos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="TODOS">Todos los partidos</SelectItem>
            {uniqueParties.map((party) => (
              party ? <SelectItem key={party} value={party}>{party}</SelectItem> : null
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVotes.length > 0 ? (
          filteredVotes.map((vote: any) => (
            <Link 
              href={`/senadores/${encodeURIComponent(vote.nombre)}`}
              key={vote.nombre}
              className="group block transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="bg-gray-900/30 backdrop-blur-sm rounded-xl p-5 border border-gray-700/50 transition-all duration-300 group-hover:bg-gray-800/50 group-hover:border-gray-600/50">
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <Avatar 
                      name={vote.nombre} 
                      imgUrl={senatorsData.find((senator: Senator) => senator.name === vote.nombre)?.img} 
                      size={56} 
                    />
                    <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center
                      ${vote.voto.toLowerCase() === "si" 
                        ? "bg-green-400/40 text-green-400/90 ring-1 ring-green-400/50" 
                        : vote.voto.toLowerCase() === "no" 
                          ? "bg-red-400/40 text-red-400/90 ring-1 ring-red-400/50"
                          : "bg-yellow-400/40 text-yellow-400/90 ring-1 ring-yellow-400/50"}`}
                    >
                      {vote.voto.toLowerCase() === "si" 
                        ? <CheckCircle2 size={14} /> 
                        : vote.voto.toLowerCase() === "no" 
                          ? <XCircle size={14} />
                          : <CircleDot size={14} />}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-100 truncate group-hover:text-white transition-colors">
                      {vote.nombre}
                    </h4>
                    <p className="text-sm text-gray-400 truncate mt-0.5">
                      {senatorsData.find((senator: Senator) => senator.name === vote.nombre)?.party || "Sin partido"}
                    </p>
                    <div className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium
                      ${vote.voto.toLowerCase() === "si" 
                        ? "bg-green-400/10 text-green-400" 
                        : vote.voto.toLowerCase() === "no" 
                          ? "bg-red-400/10 text-red-400"
                          : vote.voto.toLowerCase() === "abstencion"
                            ? "bg-yellow-400/10 text-yellow-400"
                            : "bg-gray-400/10 text-gray-400"}`}
                    >
                      {vote.voto.toLowerCase() === "si" 
                        ? "Afirmativo"
                        : vote.voto.toLowerCase() === "no"
                          ? "Negativo"
                          : vote.voto.toLowerCase() === "abstencion"
                            ? "Abstención"
                            : "Ausente"}
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center p-8 bg-gray-900/30 backdrop-blur-sm rounded-xl border border-gray-700/50">
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

