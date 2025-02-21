import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Navigation from "./components/Navigation"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Votaciones del Senado Argentino",
  description: "Evaluación de proyectos votados en el Senado de la Nación Argentina",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es" className="dark">
      <body className={`${inter.className} bg-gray-900 text-gray-100`}>
        <Navigation />
        {children}
      </body>
    </html>
  )
}



import './globals.css'