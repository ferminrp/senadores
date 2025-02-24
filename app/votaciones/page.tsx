import type { Metadata } from "next"
import VotacionesPageClient from "./VotacionesPageClient"

export const metadata: Metadata = {
  title: "Votaciones",
  description: "Consulta todas las votaciones realizadas en el Senado de la Nación Argentina, filtra por fecha, tipo y resultado.",
  openGraph: {
    title: "Votaciones",
    description: "Consulta todas las votaciones realizadas en el Senado de la Nación Argentina, filtra por fecha, tipo y resultado."
  },
  twitter: {
    title: "Votaciones",
    description: "Consulta todas las votaciones realizadas en el Senado de la Nación Argentina, filtra por fecha, tipo y resultado."
  }
}

export default function VotacionesPage() {
  return <VotacionesPageClient />
}

