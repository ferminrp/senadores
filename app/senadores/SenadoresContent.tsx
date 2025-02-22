"use client"

import { useState, useEffect } from "react"
import SenadorCard from "../components/SenadorCard"
import { useVotaciones, useSenatorsData } from "../lib/data"
import { Search } from "lucide-react"
import Skeleton from "../components/Skeleton"
import type { Senator } from "../types"
import { PaginationComponent } from "../components/Pagination"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SENATORS_PER_PAGE = 9

export default function SenadoresContent() {
  const [senadores, setSenadores] = useState<Senator[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedParty, setSelectedParty] = useState<string>("TODOS")
  const [currentPage, setCurrentPage] = useState(1)

  const { votaciones, isLoading: isLoadingVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData } = useSenatorsData()

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

  const filteredSenadores = senadores.filter((senador) => {
    const matchesSearch = senador.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesParty = selectedParty === "TODOS" || senador.party === selectedParty
    return matchesSearch && matchesParty
  })

  const paginatedSenadores = filteredSenadores.slice(
    (currentPage - 1) * SENATORS_PER_PAGE,
    currentPage * SENATORS_PER_PAGE,
  )

  const totalPages = Math.ceil(filteredSenadores.length / SENATORS_PER_PAGE)

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

