import type { Metadata } from "next"
import ComparativaContent from "./ComparativaContent"

export const metadata: Metadata = {
  title: "Comparativa de Senadores",
  description: "Compara los votos y coincidencias entre dos senadores argentinos. Analiza su historial de votaciones y descubre sus patrones de votación.",
  openGraph: {
    title: "Comparativa de Senadores | Senado Argentino",
    description: "Compara los votos y coincidencias entre dos senadores argentinos. Analiza su historial de votaciones y descubre sus patrones de votación.",
    images: [{
      url: '/meta-image.png',
      width: 1200,
      height: 630,
      alt: 'Comparativa de Senadores'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: "Comparativa de Senadores | Senado Argentino",
    description: "Compara los votos y coincidencias entre dos senadores argentinos. Analiza su historial de votaciones y descubre sus patrones de votación.",
    images: ['/meta-image.png']
  }
}

export default function Comparativa() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <ComparativaContent />
    </div>
  )
}

