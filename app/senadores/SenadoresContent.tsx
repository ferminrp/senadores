"use client"

import { useState, useEffect } from "react"
import SenadorCard from "../components/SenadorCard"
import { useVotaciones, useSenatorsData } from "../lib/data"
import { Search } from "lucide-react"
import Skeleton from "../components/Skeleton"
import type { Senator } from "../types"
import { PaginationComponent } from "../components/Pagination"

const SENATORS_PER_PAGE = 9

export default function SenadoresContent() {
  const [senadores, setSenadores] = useState<Senator[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const { votaciones, isLoading: isLoadingVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData } = useSenatorsData()

  useEffect(() => {
    if (votaciones && senatorsData) {
      const senadoresData = getSenadores(votaciones, senatorsData)
      setSenadores(senadoresData)
    }
  }, [votaciones, senatorsData])

  const filteredSenadores = senadores.filter((senador) => senador.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const paginatedSenadores = filteredSenadores.slice(
    (currentPage - 1) * SENATORS_PER_PAGE,
    currentPage * SENATORS_PER_PAGE,
  )

  const totalPages = Math.ceil(filteredSenadores.length / SENATORS_PER_PAGE)

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Senadores</h1>
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
    votacion.votes.forEach((vote: any) => {
      if (!senadores[vote.name]) {
        const senatorInfo = senatorsData.find((s) => s.name === vote.name) || {}
        senadores[vote.name] = {
          name: vote.name,
          totalVotes: 0,
          affirmativeVotes: 0,
          negativeVotes: 0,
          ...senatorInfo,
        }
      }
      senadores[vote.name].totalVotes++
      if (vote.vote === "SI") senadores[vote.name].affirmativeVotes++
      if (vote.vote === "NO") senadores[vote.name].negativeVotes++
    })
  })

  return Object.values(senadores)
}

