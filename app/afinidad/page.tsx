import type { Metadata } from "next"
import AfinidadContent from "./AfinidadContent"

export const metadata: Metadata = {
  title: "Test de Afinidad",
  description: "Descubre con qué senadores y partidos políticos tenés mayor afinidad basado en tus votos en proyectos reales.",
  openGraph: {
    title: "Test de Afinidad",
    description: "Descubre con qué senadores y partidos políticos tenés mayor afinidad basado en tus votos en proyectos reales."
  },
  twitter: {
    title: "Test de Afinidad",
    description: "Descubre con qué senadores y partidos políticos tenés mayor afinidad basado en tus votos en proyectos reales."
  }
}

export default function AfinidadPage() {
  return <AfinidadContent />
} 