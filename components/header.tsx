"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2">
            <Sun className="h-8 w-8 text-accent" />
            <span className="font-serif text-xl md:text-2xl font-semibold text-foreground">
              Instituto Odontológico Especializado
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/#equipo" className="text-muted-foreground hover:text-primary transition-colors">
              Equipo
            </Link>
            <Link href="/#nosotros" className="text-muted-foreground hover:text-primary transition-colors">
              Nosotros
            </Link>
            <Link href="/#sucursales" className="text-muted-foreground hover:text-primary transition-colors">
              Sucursales
            </Link>
            <Link href="/#servicios" className="text-muted-foreground hover:text-primary transition-colors">
              Servicios
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Link href="/reservar" className="hidden md:block">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                Sacar turno
              </Button>
            </Link>

            <button
              type="button"
              className="md:hidden p-2 text-foreground"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-4">
              <Link 
                href="/#equipo" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Equipo
              </Link>
              <Link 
                href="/#nosotros" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Nosotros
              </Link>
              <Link 
                href="/#sucursales" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sucursales
              </Link>
              <Link 
                href="/#servicios" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Servicios
              </Link>
              <Link href="/reservar" onClick={() => setIsMenuOpen(false)}>
                <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                  Sacar turno
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
