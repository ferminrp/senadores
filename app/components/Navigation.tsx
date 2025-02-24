"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import React from "react"

export default function Navigation() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = React.useState(false)

  const navigationItems = [
    ["Votaciones", "/votaciones"],
    ["Senadores", "/senadores"],
    ["Comparativa", "/comparativa"],
    ["Afinidad", "/afinidad"],
  ]

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-900 dark:text-white">
          Senado Argentino
        </Link>        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-4">
          {navigationItems.map(([title, url]) => (
            <Link
              key={url}
              href={url}
              className={`text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 ${
                pathname === url ? "border-b-2 border-gray-900 dark:border-white" : ""
              }`}
            >
              {title}
            </Link>
          ))}
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-gray-600 dark:text-white">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] bg-white dark:bg-gray-800 p-6">
            <div className="flex flex-col space-y-4">
              {navigationItems.map(([title, url]) => (
                <Link
                  key={url}
                  href={url}
                  onClick={() => setIsOpen(false)}
                  className={`text-gray-600 dark:text-white hover:text-gray-900 dark:hover:text-gray-300 text-lg ${
                    pathname === url ? "border-b-2 border-gray-900 dark:border-white" : ""
                  }`}
                >
                  {title}
                </Link>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  )
}

