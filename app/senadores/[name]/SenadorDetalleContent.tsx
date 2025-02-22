"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useVotaciones, useSenatorsData } from "../../lib/data"
import Avatar from "../../components/Avatar"
import Skeleton from "../../components/Skeleton"
import { MapPin, Mail, Phone, Twitter, Instagram, BookOpenText } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function getSenadorVotes(name: string, votaciones: any[]) {
  return votaciones
    .map((votacion: any) => {
      const vote = votacion.votos.find((v: any) => v.nombre === name)
      if (vote) {
        return {
          actId: votacion.actaId,
          motionNumber: votacion.proyecto,
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
  const [senatorInfo, setSenatorInfo] = useState<any>(null)

  useEffect(() => {
    if (votaciones) {
      const senadorVotes = getSenadorVotes(decodeURIComponent(name), votaciones)
      setVotes(senadorVotes)
    }
    if (senatorsData) {
      const info = senatorsData.find((s: any) => s.name === decodeURIComponent(name))
      setSenatorInfo(info)
    }
  }, [votaciones, senatorsData, name])

  if (isErrorVotaciones || isErrorSenatorsData) return <div>Error al cargar los datos</div>
  if (isLoadingVotaciones || isLoadingSenatorsData) return <Skeleton className="h-96" />
  if (votes.length === 0 || !senatorInfo) return <div>No se encontraron datos para este senador</div>

  const totalVotes = votes.length
  const affirmativeVotes = votes.filter((v: any) => v.vote.toLowerCase() === "si").length
  const negativeVotes = votes.filter((v: any) => v.vote.toLowerCase() === "no").length
  const abstentions = votes.filter((v: any) => v.vote.toLowerCase() === "abstencion").length

  const affirmativePercentage = ((affirmativeVotes / totalVotes) * 100).toFixed(2)
  const negativePercentage = ((negativeVotes / totalVotes) * 100).toFixed(2)
  const abstentionPercentage = ((abstentions / totalVotes) * 100).toFixed(2)

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
          <CardHeader>
            <CardTitle>Historial de votos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {votes.map((vote: any) => (
                <Link
                  href={`/votaciones/${vote.actId}`}
                  key={vote.actId}
                  className="block bg-gray-700/50 p-4 rounded-lg hover:bg-gray-700 transition-colors"
                >
                  <p className="font-bold">Moción: {vote.motionNumber || "Sin número"}</p>
                  <p className="text-gray-400">Fecha: {vote.date}</p>
                  <p
                    className={
                      vote.vote === "SI" ? "text-green-400" : vote.vote === "NO" ? "text-red-400" : "text-yellow-400"
                    }
                  >
                    Voto: {vote.vote}
                  </p>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

