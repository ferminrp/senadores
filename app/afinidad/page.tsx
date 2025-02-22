"use client"

import { useState, useEffect } from "react"
import { useVotaciones, useSenatorsData, Votacion, Senator, Voto } from "../lib/data"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ChevronLeft, ChevronRight, ArrowUpDown } from "lucide-react"
import Image from "next/image"

export default function AfinidadPage() {
  const { votaciones, isLoading: votacionesLoading } = useVotaciones()
  const { senatorsData, isLoading: senatorsLoading } = useSenatorsData()
  const [selectedVotaciones, setSelectedVotaciones] = useState<Votacion[]>([])
  const [currentVotacionIndex, setCurrentVotacionIndex] = useState(0)
  const [userVotes, setUserVotes] = useState<Record<number, string>>({})
  const [results, setResults] = useState<{
    senators: { name: string; affinity: number; foto: string; partido: string }[];
    parties: { name: string; affinity: number }[];
  } | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortAscending, setSortAscending] = useState(false)
  const senatorsPerPage = 10

  useEffect(() => {
    if (votaciones && selectedVotaciones.length === 0) {
      // Select 10 random votaciones
      const shuffled = [...votaciones].sort(() => 0.5 - Math.random())
      setSelectedVotaciones(shuffled.slice(0, 10))
    }
  }, [votaciones])

  const handleVote = (actaId: number, vote: string) => {
    setUserVotes((prev) => ({ ...prev, [actaId]: vote }))
    if (currentVotacionIndex < selectedVotaciones.length - 1) {
      setCurrentVotacionIndex(prev => prev + 1)
    }
  }

  const calculateResults = () => {
    if (!senatorsData) return

    const senatorVotes = new Map<string, { total: number; matches: number }>()
    const partyVotes = new Map<string, { total: number; matches: number }>()

    // Calculate matches for each senator
    selectedVotaciones.forEach((votacion) => {
      const userVote = userVotes[votacion.actaId]
      if (!userVote) return

      votacion.votos.forEach((voto: Voto) => {
        // Senator affinity
        const senatorCurrent = senatorVotes.get(voto.nombre) || { total: 0, matches: 0 }
        senatorCurrent.total++
        if (voto.voto === userVote) {
          senatorCurrent.matches++
        }
        senatorVotes.set(voto.nombre, senatorCurrent)

        // Party affinity
        const senator = senatorsData.find((s: Senator) => s.nombre === voto.nombre)
        if (senator) {
          const partyCurrent = partyVotes.get(senator.partido) || { total: 0, matches: 0 }
          partyCurrent.total++
          if (voto.voto === userVote) {
            partyCurrent.matches++
          }
          partyVotes.set(senator.partido, partyCurrent)
        }
      })
    })

    // Calculate percentages with senator details
    const senatorResults = Array.from(senatorVotes.entries())
      .map(([name, { total, matches }]) => {
        const senatorDetails = senatorsData.find(s => s.nombre === name)
        return {
          name,
          affinity: (matches / total) * 100,
          foto: senatorDetails?.foto || "",
          partido: senatorDetails?.partido || "",
        }
      })
      .sort((a, b) => b.affinity - a.affinity)

    const partyResults = Array.from(partyVotes.entries())
      .map(([name, { total, matches }]) => ({
        name,
        affinity: (matches / total) * 100
      }))
      .sort((a, b) => b.affinity - a.affinity)

    setResults({ senators: senatorResults, parties: partyResults })
  }

  if (votacionesLoading || senatorsLoading) {
    return <div className="container mx-auto p-4">Cargando...</div>
  }

  const progressPercentage = (Object.keys(userVotes).length / selectedVotaciones.length) * 100

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Test de Afinidad</h1>
      
      {!results ? (
        <>
          <p className="mb-4 text-center">Vote en las siguientes 10 votaciones para descubrir con qué senadores y partidos tiene mayor afinidad.</p>
          
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso</span>
              <span>{Object.keys(userVotes).length} de {selectedVotaciones.length} votaciones</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {selectedVotaciones.length > 0 && (
            <Card className="w-full">
              <CardHeader>
                <CardTitle className="text-xl">{selectedVotaciones[currentVotacionIndex].titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-6">{selectedVotaciones[currentVotacionIndex].descripcion}</p>
                <div className="flex flex-row gap-3 w-full">
                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    variant="default"
                    size="lg"
                    onClick={() => handleVote(selectedVotaciones[currentVotacionIndex].actaId, "si")}
                    disabled={userVotes[selectedVotaciones[currentVotacionIndex].actaId] !== undefined}
                  >
                    A favor
                  </Button>
                  <Button
                    className="w-full bg-red-600 hover:bg-red-700"
                    variant="default"
                    size="lg"
                    onClick={() => handleVote(selectedVotaciones[currentVotacionIndex].actaId, "no")}
                    disabled={userVotes[selectedVotaciones[currentVotacionIndex].actaId] !== undefined}
                  >
                    En contra
                  </Button>
                  <Button
                    className="w-full bg-gray-600 hover:bg-gray-700"
                    variant="default"
                    size="lg"
                    onClick={() => handleVote(selectedVotaciones[currentVotacionIndex].actaId, "ausente")}
                    disabled={userVotes[selectedVotaciones[currentVotacionIndex].actaId] !== undefined}
                  >
                    Abstención
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between text-sm text-gray-600">
                <span>Votación {currentVotacionIndex + 1} de {selectedVotaciones.length}</span>
                {Object.keys(userVotes).length === selectedVotaciones.length && (
                  <Button
                    onClick={calculateResults}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    Ver resultados
                  </Button>
                )}
              </CardFooter>
            </Card>
          )}
        </>
      ) : (
        <div className="space-y-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Afinidad con Senadores</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSortAscending(!sortAscending)}
                className="flex items-center gap-2"
              >
                Ordenar <ArrowUpDown className="h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.senators
                  .sort((a, b) => sortAscending ? a.affinity - b.affinity : b.affinity - a.affinity)
                  .slice((currentPage - 1) * senatorsPerPage, currentPage * senatorsPerPage)
                  .map((senator) => (
                    <div key={senator.name} className="flex items-center gap-4 pb-4">
                      <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden">
                        <Image
                          src={senator.foto}
                          alt={senator.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="flex justify-between mb-1">
                          <div>
                            <span className="font-medium">{senator.name}</span>
                            <span className="text-sm text-gray-500 ml-2">
                              {senator.partido}
                            </span>
                          </div>
                          <span className="font-medium">{senator.affinity.toFixed(1)}%</span>
                        </div>
                        <Progress value={senator.affinity} className="h-2" />
                      </div>
                    </div>
                  ))}
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="h-4 w-4" /> Anterior
                </Button>
                <span className="text-sm text-gray-600">
                  Página {currentPage} de {Math.ceil(results.senators.length / senatorsPerPage)}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(results.senators.length / senatorsPerPage), prev + 1))}
                  disabled={currentPage === Math.ceil(results.senators.length / senatorsPerPage)}
                  className="flex items-center gap-2"
                >
                  Siguiente <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Afinidad con Partidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {results.parties.map((party) => (
                  <div key={party.name}>
                    <div className="flex justify-between mb-1">
                      <span>{party.name}</span>
                      <span>{party.affinity.toFixed(1)}%</span>
                    </div>
                    <Progress value={party.affinity} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Button 
            onClick={() => {
              setResults(null)
              setUserVotes({})
              setCurrentVotacionIndex(0)
              // Reshuffle votaciones
              if (votaciones) {
                const shuffled = [...votaciones].sort(() => 0.5 - Math.random())
                setSelectedVotaciones(shuffled.slice(0, 10))
              }
            }}
            className="w-full"
          >
            Volver a votar
          </Button>
        </div>
      )}
    </div>
  )
} 