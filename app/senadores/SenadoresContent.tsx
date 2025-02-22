"use client"

import { useState, useEffect } from "react"
import SenadorCard from "../components/SenadorCard"
import { useVotaciones, useSenatorsData } from "../lib/data"
import { Search, AlertCircle } from "lucide-react"
import Skeleton from "../components/Skeleton"
import type { Senator } from "../types"
import { PaginationComponent } from "../components/Pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

const SENATORS_PER_PAGE = 9

type SortOption = {
  value: string
  label: string
  sortFn: (a: Senator, b: Senator) => number
}

export default function SenadoresContent() {
  const [senadores, setSenadores] = useState<Senator[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParty, setSelectedParty] = useState<string>("TODOS")
  const [currentPage, setCurrentPage] = useState(1)
  const [sortBy, setSortBy] = useState<string>("none")

  const { votaciones, isLoading: isLoadingVotaciones, isError: isErrorVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData, isError: isErrorSenatorsData } = useSenatorsData()

  useEffect(() => {
    if (votaciones && senatorsData) {
      const senadoresData = getSenadores(votaciones, senatorsData)
      setSenadores(senadoresData)
    }
  }, [votaciones, senatorsData])

  // Get unique parties from senators
  const uniqueParties = Array.from(
    new Set(
      senadores
        .map(senator => senator.party || "Sin partido")
        .filter(party => party !== "Sin partido")
    )
  ).sort()

  const sortOptions: SortOption[] = [
    {
      value: "none",
      label: "Sin ordenar",
      sortFn: () => 0
    },
    {
      value: "mostVotes",
      label: "Mayor cantidad de votos",
      sortFn: (a, b) => b.totalVotes - a.totalVotes
    },
    {
      value: "leastVotes",
      label: "Menor cantidad de votos",
      sortFn: (a, b) => a.totalVotes - b.totalVotes
    },
    {
      value: "mostPositive",
      label: "Mayor cantidad de votos positivos",
      sortFn: (a, b) => b.affirmativeVotes - a.affirmativeVotes
    },
    {
      value: "leastPositive",
      label: "Menor cantidad de votos positivos",
      sortFn: (a, b) => a.affirmativeVotes - b.affirmativeVotes
    },
    {
      value: "mostNegative",
      label: "Mayor cantidad de votos negativos",
      sortFn: (a, b) => b.negativeVotes - a.negativeVotes
    },
    {
      value: "leastNegative",
      label: "Menor cantidad de votos negativos",
      sortFn: (a, b) => a.negativeVotes - b.negativeVotes
    },
    {
      value: "mostAbstentions",
      label: "Mayor cantidad de abstenciones",
      sortFn: (a, b) => (b.totalVotes - b.affirmativeVotes - b.negativeVotes) - 
                        (a.totalVotes - a.affirmativeVotes - a.negativeVotes)
    },
    {
      value: "leastAbstentions",
      label: "Menor cantidad de abstenciones",
      sortFn: (a, b) => (a.totalVotes - a.affirmativeVotes - a.negativeVotes) - 
                        (b.totalVotes - b.affirmativeVotes - b.negativeVotes)
    }
  ]

  const filteredSenadores = senadores
    .filter((senador) => {
      const matchesSearch = senador.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesParty = selectedParty === "TODOS" || senador.party === selectedParty
      return matchesSearch && matchesParty
    })
    .sort(sortOptions.find(option => option.value === sortBy)?.sortFn || (() => 0))

  const paginatedSenadores = filteredSenadores.slice(
    (currentPage - 1) * SENATORS_PER_PAGE,
    currentPage * SENATORS_PER_PAGE,
  )

  const totalPages = Math.ceil(filteredSenadores.length / SENATORS_PER_PAGE)

  if (isErrorVotaciones || isErrorSenatorsData) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-red-900/20 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">No pudimos cargar los senadores</h1>
          <p className="text-gray-400 max-w-md mb-8">
            Hubo un problema al cargar los datos de los senadores. Esto puede deberse a problemas de conexión o mantenimiento del servidor.
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

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Senadores</h1>
      <div className="space-y-4 mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar senador..."
            className="w-full p-2 pl-10 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select value={selectedParty} onValueChange={setSelectedParty}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Filtrar por partido" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos los partidos</SelectItem>
              {uniqueParties.map((party) => (
                <SelectItem key={party} value={party}>
                  {party}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Ordenar por..." />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoadingVotaciones || isLoadingSenatorsData
          ? Array.from({ length: SENATORS_PER_PAGE }).map((_, index) => (
              <div key={index} className="bg-gray-800 rounded-lg shadow-md p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <Skeleton className="h-6 w-3/4" />
                </div>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-2.5 w-full mb-2" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </div>
            ))
          : paginatedSenadores.map((senador) => <SenadorCard key={senador.name} {...senador} />)}
      </div>
      {totalPages > 1 && (
        <div className="mt-8">
          <PaginationComponent currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </main>
  )
}

function getSenadores(votaciones: any[], senatorsData: any[]): Senator[] {
  const senadores: { [key: string]: Senator } = {}

  votaciones.forEach((votacion: any) => {
    votacion.votos.forEach((vote: any) => {
      if (!senadores[vote.nombre]) {
        const senatorInfo = senatorsData.find((s) => s.name === vote.nombre) || {}
        senadores[vote.nombre] = {
          name: vote.nombre,
          totalVotes: 0,
          affirmativeVotes: 0,
          negativeVotes: 0,
          ...senatorInfo,
        }
      }
      senadores[vote.nombre].totalVotes++
      if (vote.voto === "si") senadores[vote.nombre].affirmativeVotes++
      if (vote.voto === "no") senadores[vote.nombre].negativeVotes++
    })
  })

  return Object.values(senadores)
}

