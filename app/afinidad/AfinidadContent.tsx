"use client"

import { useState } from "react"
import { useVotaciones, useSenatorsData } from "../lib/data"
import type { Senator } from "../types"
import type { Votacion } from "../lib/data"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import SenadorCard from "../components/SenadorCard"
import Skeleton from "../components/Skeleton"
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"

type UserVote = {
  title: string
  vote: string
}

interface SenatorMatch {
  senator: Senator
  matchPercentage: number
  matchCount: number
  totalVotes: number
}

type SortOption = {
  value: string
  label: string
  sortFn: (a: SenatorMatch, b: SenatorMatch) => number
}

export default function AfinidadContent() {
  const [userVotes, setUserVotes] = useState<UserVote[]>([])
  const [showResults, setShowResults] = useState(false)
  const [matchedSenators, setMatchedSenators] = useState<SenatorMatch[]>([])
  const [sortBy, setSortBy] = useState<string>("afinidad-desc")
  const { votaciones, isLoading: isLoadingVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData } = useSenatorsData()

  const sortOptions: SortOption[] = [
    {
      value: "afinidad-desc",
      label: "Mayor afinidad primero",
      sortFn: (a, b) => b.matchPercentage - a.matchPercentage
    },
    {
      value: "afinidad-asc",
      label: "Menor afinidad primero",
      sortFn: (a, b) => a.matchPercentage - b.matchPercentage
    },
    {
      value: "name-asc",
      label: "Nombre A-Z",
      sortFn: (a, b) => a.senator.name.localeCompare(b.senator.name)
    },
    {
      value: "name-desc",
      label: "Nombre Z-A",
      sortFn: (a, b) => b.senator.name.localeCompare(a.senator.name)
    }
  ]

  const getSortedSenators = () => {
    const sortFn = sortOptions.find(option => option.value === sortBy)?.sortFn
    return sortFn ? [...matchedSenators].sort(sortFn) : matchedSenators
  }

  const handleVote = (title: string, vote: string) => {
    setUserVotes(prev => {
      const existing = prev.find(v => v.title === title)
      if (existing && existing.vote === vote) {
        return prev.filter(v => v.title !== title)
      }
      if (existing) {
        return prev.map(v => v.title === title ? { ...v, vote } : v)
      }
      return [...prev, { title, vote }]
    })
  }

  const calculateMatches = () => {
    if (!votaciones || !senatorsData || userVotes.length === 0) return

    const senatorMatches = senatorsData.map((senator: Senator) => {
      let matchCount = 0
      let totalVotes = 0

      userVotes.forEach(userVote => {
        const votacion = votaciones.find(v => v.titulo === userVote.title)
        if (!votacion) return

        const senatorVote = votacion.votos.find(v => v.nombre.trim() === senator.name.trim())
        if (!senatorVote) {
          console.log('No vote found for senator:', senator.name, 'in votacion:', votacion.titulo)
          return
        }

        // Map vote values to match the format
        const normalizedUserVote = userVote.vote === "AFIRMATIVO" ? "AFIRMATIVO" :
                                  userVote.vote === "NEGATIVO" ? "NEGATIVO" :
                                  userVote.vote === "ABSTENCION" ? "ABSTENCION" : ""

        // Debug the actual comparison
        console.log('Vote comparison:', {
          senator: senator.name,
          votacion: votacion.titulo,
          userVote: normalizedUserVote,
          senatorVote: senatorVote.voto,
          matches: normalizedUserVote === senatorVote.voto
        })

        if (normalizedUserVote === senatorVote.voto) {
          matchCount++
        }
        totalVotes++
      })

      const matchPercentage = totalVotes > 0 ? (matchCount / totalVotes) * 100 : 0

      return { 
        senator, 
        matchPercentage,
        matchCount,
        totalVotes // Adding these for debugging
      }
    }).filter((match: SenatorMatch) => match.totalVotes > 0) // Only include senators who voted

    const sortFn = sortOptions.find(option => option.value === sortBy)?.sortFn
    setMatchedSenators(senatorMatches.sort(sortFn || sortOptions[0].sortFn))
    setShowResults(true)
  }

  if (isLoadingVotaciones || isLoadingSenatorsData) {
    return <div className="container mx-auto p-4"><Skeleton className="h-96" /></div>
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Encuentra tu Afinidad Política</h1>
      <div className="space-y-6">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold">Últimas Votaciones</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {votaciones?.slice(0, 10).map((votacion: Votacion) => {
              const currentVote = userVotes.find(v => v.title === votacion.titulo)?.vote

              return (
                <Card key={votacion.titulo} className="p-4">
                  <h3 className="font-medium mb-2 break-words">{votacion.titulo}</h3>
                  <p className="text-sm text-gray-400 mb-2">{votacion.descripcion}</p>
                  <p className="text-sm text-gray-400 mb-4">Fecha: {new Date(votacion.fecha).toLocaleDateString()}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant={currentVote === "AFIRMATIVO" ? "default" : "outline"}
                      onClick={() => handleVote(votacion.titulo, "AFIRMATIVO")}
                    >
                      A favor
                    </Button>
                    <Button 
                      variant={currentVote === "NEGATIVO" ? "default" : "outline"}
                      onClick={() => handleVote(votacion.titulo, "NEGATIVO")}
                    >
                      En contra
                    </Button>
                    <Button 
                      variant={currentVote === "ABSTENCION" ? "default" : "outline"}
                      onClick={() => handleVote(votacion.titulo, "ABSTENCION")}
                    >
                      Abstención
                    </Button>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        <div className="flex justify-center">
          <Button 
            size="lg"
            onClick={calculateMatches}
            disabled={userVotes.length === 0}
          >
            Ver Resultados
          </Button>
        </div>

        {showResults && matchedSenators.length > 0 && (
          <section className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-semibold">Senadores con Mayor Afinidad</h2>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Ordenar por..." />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {getSortedSenators().slice(0, 6).map(({senator, matchPercentage}) => (
                <div key={senator.name} className="relative">
                  <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-sm z-10">
                    {matchPercentage.toFixed(1)}% de coincidencia
                  </div>
                  <SenadorCard {...senator} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}
