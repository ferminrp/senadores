"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useVotaciones, useSenatorsData } from "../../lib/data"
import Avatar from "../../components/Avatar"
import Skeleton from "../../components/Skeleton"
import { MapPin, Mail, Phone, Twitter, Instagram, BookOpenText, AlertCircle, UserCheck, UserX } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function truncateText(text: string, maxLength: number = 32) {
  return text.length > maxLength ? text.substring(0, maxLength - 3) + "..." : text
}

function getSenadorVotes(name: string, votaciones: any[]) {
  return votaciones
    .map((votacion: any) => {
      const vote = votacion.votos.find((v: any) => v.nombre === name)
      if (vote) {
        return {
          actId: votacion.actaId,
          motionNumber: votacion.proyecto,
          title: votacion.titulo,
          date: votacion.fecha,
          vote: vote.voto,
        }
      }
      return null
    })
    .filter(Boolean)
}

export default function SenadorDetalleContent({ name }: { name: string }) {
  const { votaciones, isLoading: isLoadingVotaciones, isError: isErrorVotaciones } = useVotaciones()
  const { senatorsData, isLoading: isLoadingSenatorsData, isError: isErrorSenatorsData } = useSenatorsData()
  const [votes, setVotes] = useState<any[]>([])
  const [filteredVotes, setFilteredVotes] = useState<any[]>([])
  const [voteFilter, setVoteFilter] = useState<string>("todos")
  const [senatorInfo, setSenatorInfo] = useState<any>(null)

  useEffect(() => {
    if (votaciones) {
      const senadorVotes = getSenadorVotes(decodeURIComponent(name), votaciones)
      setVotes(senadorVotes)
      setFilteredVotes(senadorVotes)
    }
    if (senatorsData) {
      const info = senatorsData.find((s: any) => s.nombre === decodeURIComponent(name))
      if (info) {
        setSenatorInfo({
          name: info.nombre,
          img: info.foto,
          party: info.partido,
          province: info.provincia,
          email: info.email,
          telefono: info.telefono,
          twitter: info.redes?.find((red: string) => red.includes('twitter.com')),
          instagram: info.redes?.find((red: string) => red.includes('instagram.com'))
        })
      }
    }
  }, [votaciones, senatorsData, name])

  useEffect(() => {
    if (voteFilter === "todos") {
      setFilteredVotes(votes)
    } else if (voteFilter === "ausente") {
      setFilteredVotes(votes.filter((vote) => !["si", "no", "abstencion"].includes(vote.vote.toLowerCase())))
    } else {
      setFilteredVotes(votes.filter((vote) => vote.vote.toLowerCase() === voteFilter))
    }
  }, [voteFilter, votes])

  if (isErrorVotaciones || isErrorSenatorsData) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-red-900/20 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">No pudimos cargar los datos del senador</h1>
          <p className="text-gray-400 max-w-md mb-8">
            Hubo un problema al cargar la información del senador. Esto puede deberse a problemas de conexión o mantenimiento del servidor.
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

  if (isLoadingVotaciones || isLoadingSenatorsData) return <Skeleton className="h-96" />
  if (votes.length === 0 || !senatorInfo) {
    return (
      <main className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
          <div className="bg-red-900/20 p-4 rounded-full mb-6">
            <AlertCircle className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Senador no encontrado</h1>
          <p className="text-gray-400 max-w-md mb-8">
            No pudimos encontrar la información del senador solicitado. Es posible que el senador ya no esté en funciones o que la URL sea incorrecta.
          </p>
          <Button 
            onClick={() => window.history.back()}
            variant="secondary"
            size="lg"
            className="font-medium"
          >
            Volver atrás
          </Button>
        </div>
      </main>
    )
  }

  const totalVotes = votes.length
  const affirmativeVotes = votes.filter((v: any) => v.vote.toLowerCase() === "si").length
  const negativeVotes = votes.filter((v: any) => v.vote.toLowerCase() === "no").length
  const abstentions = votes.filter((v: any) => v.vote.toLowerCase() === "abstencion").length
  const absentVotes = votes.filter((v: any) => !["si", "no", "abstencion"].includes(v.vote.toLowerCase())).length

  const affirmativePercentage = ((affirmativeVotes / totalVotes) * 100).toFixed(2)
  const negativePercentage = ((negativeVotes / totalVotes) * 100).toFixed(2)
  const abstentionPercentage = ((abstentions / totalVotes) * 100).toFixed(2)
  const attendancePercentage = (((totalVotes - absentVotes) / totalVotes) * 100).toFixed(2)

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Información del Senador */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-6">
              <Avatar name={senatorInfo.name} imgUrl={senatorInfo.img} size={128} />
              <div className="flex-1 text-center sm:text-left">
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{senatorInfo.name}</h1>
                {senatorInfo.party && <p className="text-lg text-gray-400 mb-4">{senatorInfo.party}</p>}
                <div className="space-y-3">
                  {senatorInfo.province && (
                    <div className="flex items-center text-gray-300 justify-center sm:justify-start">
                      <MapPin size={20} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{senatorInfo.province}</span>
                    </div>
                  )}
                  {senatorInfo.email && (
                    <div className="flex items-center text-gray-300 justify-center sm:justify-start">
                      <Mail size={20} className="mr-2 flex-shrink-0" />
                      <span className="truncate">{senatorInfo.email}</span>
                    </div>
                  )}
                  {senatorInfo.telefono && (
                    <div className="flex items-center text-gray-300 justify-center sm:justify-start">
                      <Phone size={20} className="mr-2 flex-shrink-0" />
                      <span>{senatorInfo.telefono}</span>
                    </div>
                  )}
                </div>
                <div className="flex justify-center sm:justify-start space-x-4 mt-4">
                  {senatorInfo.wikipedia_url && (
                    <a
                      href={senatorInfo.wikipedia_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <BookOpenText size={24} />
                    </a>
                  )}
                  {senatorInfo.twitter && (
                    <a
                      href={senatorInfo.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300"
                    >
                      <Twitter size={24} />
                    </a>
                  )}
                  {senatorInfo.instagram && (
                    <a
                      href={senatorInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-pink-400 hover:text-pink-300"
                    >
                      <Instagram size={24} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resumen de Votos */}
        <Card>
          <CardHeader>
            <CardTitle>Resumen de votos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-4 bg-gray-700 rounded-lg">
                <p className="text-sm text-gray-400">Total</p>
                <p className="text-2xl font-bold">{totalVotes}</p>
              </div>
              <div className="text-center p-4 bg-green-900/50 rounded-lg">
                <p className="text-sm text-green-400">Afirmativos</p>
                <p className="text-2xl font-bold text-green-400">{affirmativeVotes}</p>
              </div>
              <div className="text-center p-4 bg-red-900/50 rounded-lg">
                <p className="text-sm text-red-400">Negativos</p>
                <p className="text-2xl font-bold text-red-400">{negativeVotes}</p>
              </div>
              <div className="text-center p-4 bg-yellow-900/50 rounded-lg">
                <p className="text-sm text-yellow-400">Abstenciones</p>
                <p className="text-2xl font-bold text-yellow-400">{abstentions}</p>
              </div>
            </div>

            <div className="w-full bg-gray-700 rounded-full h-2.5 mb-4 overflow-hidden">
              <div
                className="h-full"
                style={{
                  background: `linear-gradient(to right, 
                    #22c55e 0%, 
                    #22c55e ${affirmativePercentage}%, 
                    #ef4444 ${affirmativePercentage}%, 
                    #ef4444 ${Number(affirmativePercentage) + Number(negativePercentage)}%,
                    #eab308 ${Number(affirmativePercentage) + Number(negativePercentage)}%,
                    #eab308 100%
                  )`,
                  width: "100%",
                }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-green-400">Afirmativo: {affirmativePercentage}%</span>
              <span className="text-red-400">Negativo: {negativePercentage}%</span>
              <span className="text-yellow-400">Abstención: {abstentionPercentage}%</span>
            </div>
          </CardContent>
        </Card>

        {/* Historial de Votos */}
        <Card>
          <CardHeader className="space-y-4">
            <CardTitle>Historial de votos</CardTitle>
            <div className="w-full sm:w-[200px]">
              <Select value={voteFilter} onValueChange={setVoteFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por voto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los votos</SelectItem>
                  <SelectItem value="si">Afirmativos</SelectItem>
                  <SelectItem value="no">Negativos</SelectItem>
                  <SelectItem value="abstencion">Abstenciones</SelectItem>
                  <SelectItem value="ausente">Ausentes</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filteredVotes.map((vote: any) => {
                const voteType = vote.vote.toLowerCase();
                const getVoteStyles = () => {
                  switch (voteType) {
                    case "si":
                      return {
                        bg: "bg-green-900/20",
                        border: "border-green-500/20",
                        text: "text-green-400",
                        hover: "hover:bg-green-900/30 hover:border-green-500/30"
                      };
                    case "no":
                      return {
                        bg: "bg-red-900/20",
                        border: "border-red-500/20",
                        text: "text-red-400",
                        hover: "hover:bg-red-900/30 hover:border-red-500/30"
                      };
                    case "abstencion":
                      return {
                        bg: "bg-yellow-900/20",
                        border: "border-yellow-500/20",
                        text: "text-yellow-400",
                        hover: "hover:bg-yellow-900/30 hover:border-yellow-500/30"
                      };
                    default:
                      return {
                        bg: "bg-gray-800/50",
                        border: "border-gray-700",
                        text: "text-gray-400",
                        hover: "hover:bg-gray-800/70 hover:border-gray-600"
                      };
                  }
                };

                const styles = getVoteStyles();

                return (
                  <Link
                    href={`/votaciones/${vote.actId}`}
                    key={vote.actId}
                    className={`block p-4 rounded-xl border transition-all duration-200 ${styles.bg} ${styles.border} ${styles.hover}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1 truncate" title={vote.title || vote.motionNumber || "Sin título"}>
                          {truncateText(vote.title || vote.motionNumber || "Sin título", 60)}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(vote.date).toLocaleDateString('es-AR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${styles.bg} ${styles.text} border ${styles.border}`}>
                        {voteType === "si" && "Afirmativo"}
                        {voteType === "no" && "Negativo"}
                        {voteType === "abstencion" && "Abstención"}
                        {!["si", "no", "abstencion"].includes(voteType) && "Ausente"}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Presentismo */}
        <Card>
          <CardHeader>
            <CardTitle>Presentismo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-6">
              <div className="relative w-48 h-48">
                <div className="w-full h-full rounded-full bg-gray-700 absolute" />
                <div 
                  className="w-full h-full rounded-full absolute"
                  style={{
                    background: `conic-gradient(#22c55e 0% ${attendancePercentage}%, #ef4444 ${attendancePercentage}% 100%)`,
                    transform: 'rotate(-90deg)'
                  }}
                />
                <div className="absolute inset-4 rounded-full bg-background flex items-center justify-center flex-col">
                  <span className="text-4xl font-bold">{attendancePercentage}%</span>
                  <span className="text-sm text-gray-400">Presentismo</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 w-full max-w-md">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-green-900/20 text-green-400">
                    <UserCheck size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-400">{totalVotes - absentVotes}</p>
                    <p className="text-sm text-gray-400">Votaciones presente</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-full bg-red-900/20 text-red-400">
                    <UserX size={24} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-400">{absentVotes}</p>
                    <p className="text-sm text-gray-400">Votaciones ausente</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

