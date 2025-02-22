"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-white">
          Senado Argentino
        </Link>
        <div className="space-x-4">
          {[
            ["Votaciones", "/votaciones"],
            ["Senadores", "/senadores"],
            ["Comparativa", "/comparativa"],
            ["Afinidad", "/afinidad"],
          ].map(([title, url]) => (
            <Link
              key={url}
              href={url}
              className={`text-white hover:text-gray-300 ${pathname === url ? "border-b-2 border-white" : ""}`}
            >
              {title}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  )
}

