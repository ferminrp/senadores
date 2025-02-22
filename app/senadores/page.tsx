import type { Metadata } from "next"
import SenadoresContent from "./SenadoresContent"

export const metadata: Metadata = {
  title: "Senadores",
  description: "Explora el listado completo de senadores, sus bloques políticos y su historial de votaciones en el Senado de la Nación Argentina.",
  openGraph: {
    title: "Senadores",
    description: "Explora el listado completo de senadores, sus bloques políticos y su historial de votaciones en el Senado de la Nación Argentina."
  },
  twitter: {
    title: "Senadores",
    description: "Explora el listado completo de senadores, sus bloques políticos y su historial de votaciones en el Senado de la Nación Argentina."
  }
}

export default function Senadores() {
  return <SenadoresContent />
}

