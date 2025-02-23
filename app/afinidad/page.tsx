import type { Metadata } from "next"
import AfinidadContent from "./AfinidadContent"

export const metadata: Metadata = {
  title: "Test de Afinidad",
  description: "Descubre con qué senadores y partidos políticos tenés mayor afinidad basado en tus votos en proyectos reales.",
  openGraph: {
    title: "Test de Afinidad | Senado Argentino",
    description: "Descubre con qué senadores y partidos políticos tenés mayor afinidad basado en tus votos en proyectos reales.",
    images: [{
      url: '/meta-image.png',
      width: 1200,
      height: 630,
      alt: 'Test de Afinidad con Senadores'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Test de Afinidad | Senado Argentino",
    description: "Descubre con qué senadores y partidos políticos tenés mayor afinidad basado en tus votos en proyectos reales.",
    images: ['/meta-image.png']
  }
}

export default function AfinidadPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <AfinidadContent />
    </div>
  )
} 