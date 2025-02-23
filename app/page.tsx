import type { Metadata } from "next"
import HomeClient from "./HomeClient"

export const metadata: Metadata = {
  title: "Inicio",
  description: "Bienvenido al portal de transparencia del Senado Argentino. Explora votaciones, analiza senadores y compara sus posiciones.",
  openGraph: {
    title: "Inicio",
    description: "Bienvenido al portal de transparencia del Senado Argentino. Explora votaciones, analiza senadores y compara sus posiciones."
  },
  twitter: {
    title: "Inicio",
    description: "Bienvenido al portal de transparencia del Senado Argentino. Explora votaciones, analiza senadores y compara sus posiciones."
  }
}

export default function Home() {
  return <HomeClient />
}

