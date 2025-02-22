"use client"

import Link from "next/link"
import ProgressBar from "./ProgressBar"
import { Badge } from "@/components/ui/badge"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

type VotacionCardProps = {
  id: string
  motionNumber: string
  projectTitle: string
  date: string
  affirmative: number
  negative: number
  abstentions: number
  result: string
}

export default function VotacionCard({
  id,
  motionNumber,
  projectTitle,
  date,
  affirmative,
  negative,
  abstentions,
  result,
}: VotacionCardProps) {
  const total = affirmative + negative + abstentions
  const affirmativePercentage = ((affirmative / total) * 100).toFixed(2)
  const negativePercentage = ((negative / total) * 100).toFixed(2)
  const abstentionsPercentage = ((abstentions / total) * 100).toFixed(2)

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

  const truncatedTitle = projectTitle?.length > 50 
    ? `${projectTitle.substring(0, 50)}...` 
    : projectTitle || "Sin título"

  return (
    <Link
      href={`/votaciones/${id}`}
      className="block p-6 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
    >
      <div className="flex justify-between items-center mb-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <h2 className="text-2xl font-bold truncate">{truncatedTitle}</h2>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-sm">{projectTitle || "Sin título"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <Badge variant={getBadgeVariant(result)} className="text-sm shrink-0">{result}</Badge>
      </div>
      <p className="text-gray-400 mb-4">Fecha: {date}</p>
      <ProgressBar affirmative={affirmative} negative={negative} abstentions={abstentions} />
      <div className="flex justify-between text-sm mt-4">
        <span className="flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span className="text-green-400">Afirmativo: {affirmativePercentage}%</span>
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          <span className="text-red-400">Negativo: {negativePercentage}%</span>
        </span>
        <span className="flex items-center">
          <span className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></span>
          <span className="text-yellow-400">Abstenciones: {abstentionsPercentage}%</span>
        </span>
      </div>
    </Link>
  )
}

