"use client"

import { useState, useEffect } from "react"
import { useVotaciones, useSenatorsData } from "../lib/data"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Avatar from "../components/Avatar"
import Skeleton from "../components/Skeleton"
import { Scale } from "lucide-react"

type SenatorData = {
  name: string
  img: string
  party?: string
  wikipedia_url?: string
  province?: string
  email?: string
  telefono?: string
  twitter?: string
  instagram?: string
}

type Senator = {
  name: string
  imgUrl: string
  party: string
  totalVotes: number
}

type Votacion = {
  act_id: string
  motion_number: string
  project_title: string
  votes: { name: string; vote: string }[]
}

type VoteComparison = {
  totalVotes: number
  matchingVotes: number
  matchPercentage: number
  matchingProjects: { id: string; motionNumber: string; projectTitle: string; vote: string }[]
  differingProjects: { id: string; motionNumber: string; projectTitle: string; votes: { [key: string]: string } }[]
}

export default function ComparativaContent() {
  const [senators, setSenators] = useState<Senator[]>([])
  const [selectedSenator1, setSelectedSenator1] = useState<string>("")
  const [selectedSenator2, setSelectedSenator2] = useState<string>("")
  const [comparison, setComparison] = useState<VoteComparison | null>(null)

  const { votaciones, isLoading: isLoadingVotaciones, isError: isErrorVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData, isError: isErrorSenatorsData } = useSenatorsData()

  const truncateText = (text: string, maxLength: number = 32) => {
    return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text
  }

  useEffect(() => {
    if (senatorsData && votaciones) {
      const senatorVoteCounts: { [key: string]: number } = {}
      
      // Count total votes per senator
      votaciones.forEach((votacion: Votacion) => {
        votacion.votes.forEach((vote) => {
          if (!senatorVoteCounts[vote.name]) {
            senatorVoteCounts[vote.name] = 0
          }
          senatorVoteCounts[vote.name]++
        })
      })

      const senatorsList = senatorsData.map((senator: SenatorData) => ({
        name: senator.name,
        imgUrl: senator.img,
        party: truncateText(senator.party || "Sin partido"),
        totalVotes: senatorVoteCounts[senator.name] || 0
      }))
      setSenators(senatorsList)
    }
  }, [senatorsData, votaciones])

  useEffect(() => {
    if (selectedSenator1 && selectedSenator2 && votaciones) {
      compareSenators()
    }
  }, [selectedSenator1, selectedSenator2, votaciones])

  const compareSenators = () => {
    let totalVotes = 0
    let matchingVotes = 0
    const matchingProjects: VoteComparison["matchingProjects"] = []
    const differingProjects: VoteComparison["differingProjects"] = []

    votaciones.forEach((votacion: Votacion) => {
      const vote1 = votacion.votes.find((v) => v.name === selectedSenator1)?.vote
      const vote2 = votacion.votes.find((v) => v.name === selectedSenator2)?.vote

      if (vote1 && vote2) {
        totalVotes++
        if (vote1 === vote2) {
          matchingVotes++
          matchingProjects.push({
            id: votacion.act_id,
            motionNumber: votacion.motion_number,
            projectTitle: votacion.project_title,
            vote: vote1,
          })
        } else {
          differingProjects.push({
            id: votacion.act_id,
            motionNumber: votacion.motion_number,
            projectTitle: votacion.project_title,
            votes: { [selectedSenator1]: vote1, [selectedSenator2]: vote2 },
          })
        }
      }
    })

    const matchPercentage = (matchingVotes / totalVotes) * 100

    setComparison({
      totalVotes,
      matchingVotes,
      matchPercentage,
      matchingProjects,
      differingProjects,
    })
  }

  if (isErrorVotaciones || isErrorSenatorsData) return <div>Error al cargar los datos</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Comparativa de Senadores</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select onValueChange={setSelectedSenator1} value={selectedSenator1}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el primer senador">
                    {selectedSenator1 && (
                      <div className="flex items-center">
                        <Avatar
                          name={selectedSenator1}
                          imgUrl={senators.find(s => s.name === selectedSenator1)?.imgUrl}
                          size={24}
                        />
                        <div className="ml-2 text-left">
                          <div>{selectedSenator1}</div>
                          <div className="text-sm text-gray-400">
                            {senators.find(s => s.name === selectedSenator1)?.party} • {senators.find(s => s.name === selectedSenator1)?.totalVotes} votos
                          </div>
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {senators.map((senator) => (
                    <SelectItem key={senator.name} value={senator.name}>
                      <div className="flex items-center">
                        <Avatar name={senator.name} imgUrl={senator.imgUrl} size={24} />
                        <div className="ml-2">
                          <div>{senator.name}</div>
                          <div className="text-sm text-gray-400">
                            {senator.party} • {senator.totalVotes} votos
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select onValueChange={setSelectedSenator2} value={selectedSenator2}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona el segundo senador">
                    {selectedSenator2 && (
                      <div className="flex items-center">
                        <Avatar
                          name={selectedSenator2}
                          imgUrl={senators.find(s => s.name === selectedSenator2)?.imgUrl}
                          size={24}
                        />
                        <div className="ml-2 text-left">
                          <div>{selectedSenator2}</div>
                          <div className="text-sm text-gray-400">
                            {senators.find(s => s.name === selectedSenator2)?.party} • {senators.find(s => s.name === selectedSenator2)?.totalVotes} votos
                          </div>
                        </div>
                      </div>
                    )}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {senators.map((senator) => (
                    <SelectItem key={senator.name} value={senator.name}>
                      <div className="flex items-center">
                        <Avatar name={senator.name} imgUrl={senator.imgUrl} size={24} />
                        <div className="ml-2">
                          <div>{senator.name}</div>
                          <div className="text-sm text-gray-400">
                            {senator.party} • {senator.totalVotes} votos
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {isLoadingVotaciones || isLoadingSenatorsData ? (
          <Skeleton className="h-96" />
        ) : !selectedSenator1 || !selectedSenator2 ? (
          <Card>
            <CardContent className="p-12">
              <div className="flex flex-col items-center text-center text-gray-400">
                <Scale size={48} className="mb-4" />
                <h3 className="text-lg font-medium mb-2">Selecciona dos senadores para comparar</h3>
                <p>Podrás ver sus coincidencias en votaciones y analizar sus diferencias</p>
              </div>
            </CardContent>
          </Card>
        ) : comparison ? (
          <>
            <Card>
              <CardHeader>
                <CardTitle>Resumen de la Comparación</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400">Total de votos</p>
                    <p className="text-2xl font-bold">{comparison.totalVotes}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400">Votos coincidentes</p>
                    <p className="text-2xl font-bold">{comparison.matchingVotes}</p>
                  </div>
                  <div className="text-center p-4 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-400">Porcentaje de coincidencia</p>
                    <p className="text-2xl font-bold">{comparison.matchPercentage.toFixed(2)}%</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proyectos Coincidentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparison.matchingProjects.map((project) => (
                    <div key={project.id} className="p-3 bg-gray-800 rounded-lg">
                      <p className="font-medium truncate" title={project.projectTitle}>
                        {project.projectTitle || "Sin título"}
                      </p>
                      <p
                        className={`text-sm ${
                          project.vote === "SI"
                            ? "text-green-400"
                            : project.vote === "NO"
                              ? "text-red-400"
                              : "text-yellow-400"
                        }`}
                      >
                        Ambos votaron: {project.vote}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Proyectos Disidentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {comparison.differingProjects.map((project) => (
                    <div key={project.id} className="p-3 bg-gray-800 rounded-lg">
                      <p className="font-medium truncate" title={project.projectTitle}>
                        {project.projectTitle || "Sin título"}
                      </p>
                      <div className="flex flex-col sm:flex-row sm:justify-between mt-1 text-sm">
                        <p
                          className={`${
                            project.votes[selectedSenator1] === "SI"
                              ? "text-green-400"
                              : project.votes[selectedSenator1] === "NO"
                                ? "text-red-400"
                                : "text-yellow-400"
                          }`}
                        >
                          {selectedSenator1}: {project.votes[selectedSenator1]}
                        </p>
                        <p
                          className={`${
                            project.votes[selectedSenator2] === "SI"
                              ? "text-green-400"
                              : project.votes[selectedSenator2] === "NO"
                                ? "text-red-400"
                                : "text-yellow-400"
                          }`}
                        >
                          {selectedSenator2}: {project.votes[selectedSenator2]}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  )
}

