"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfessionalContext } from "@/context/professionalsContext"
import { cn } from "@/lib/utils"

interface HeaderProps {
  isAdmin?: boolean
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()

  // Evaluamos en qué sección del admin estamos parados
  const isGestionTurnosActive = pathname === "/admin"
  const isAgendaSemanalActive = pathname.startsWith("/admin/")

  // Consumimos los profesionales directamente del contexto global
  const { professionals, loading: loadingPros } = useProfessionalContext()

  // Cerrar el dropdown si el usuario hace clic afuera de él
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleProfessionalSelect = (id: string) => {
    setIsDropdownOpen(false)
    router.push(`/admin/${id}`)
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border ${isAdmin ? "bg-foreground" : "bg-background/95"} w-screen`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="flex items-center gap-2 z-10">
            {/* <Sun className="h-8 w-8 text-accent" /> */}
            <img src="/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview8.png" className="h-15 w-auto object-contain block pb-2"/>
            <span className={`font-serif text-xl md:text-2xl font-semibold ${isAdmin ? "text-background/95" : "text-foreground"}`}>
              Instituto Odontológico Austral
            </span>
          </Link>
          {isAdmin && (
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block z-10">
              <span className="text-muted-foreground font-medium text-xs md:text-sm tracking-wide bg-muted px-3 py-1.5 rounded-full border border-border/50 whitespace-nowrap">
                Panel de Administración
              </span>
            </div>
          )}

            {isAdmin ? (
              
              <nav className="hidden md:flex items-center gap-8">
                {/* <Link href="/admin" className="text-muted-foreground hover:text-primary transition-colors">
                  Gestion turnos
                </Link> */}
                <Link 
                  href="/admin" 
                  className={` 
                    ${isGestionTurnosActive ? 
                      "text-background/60 pointer-events-none cursor-default" 
                    : 
                      "text-background cursor-pointer hover:text-primary"
                    } 
                    font-medium 
                    text-sm
                  `}
                  // tabIndex={-1} // Evita que se pueda seleccionar con la tecla Tab
                  // aria-disabled="true" // Buena práctica para accesibilidad
                >
                  Gestión turnos
                </Link>

                {/* Custom Dropdown Select para Agenda Semanal */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className={` 
                      flex 
                      items-center 
                      gap-1 
                      transition-colors 
                      text-sm  
                      focus:outline-none
                      text-background 
                      cursor-pointer 
                      hover:text-primary
                  `}
                  >
                    Agenda semanal
                    <ChevronDown className={`h-4 w-4 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Lista Desplegable flotante */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-md border border-border bg-popover shadow-lg z-50 py-1 animate-in fade-in-50 slide-in-from-top-1">
                      {loadingPros ? (
                        <div className="px-4 py-2 text-xs text-muted-foreground">Cargando profesionales...</div>
                      ) : !Array.isArray(professionals) || professionals.length === 0 ? (
                        <div className="px-4 py-2 text-xs text-muted-foreground">No hay profesionales.</div>
                      ) : (
                        professionals.map((pro) => (
                          <button
                            key={pro.id}
                            onClick={() => handleProfessionalSelect(pro.id)}
                            className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors font-normal cursor-pointer block truncate"
                          >
                            <span className="block font-medium">{pro.name}</span>
                            <span className="block text-[10px] text-muted-foreground truncate">{pro.specialties?.[0] || "Odontología"}</span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>
              </nav>
            ) : (
              <> 
                <nav className="hidden md:flex items-center gap-8">
                  <Link href="/#equipo" className="text-muted-foreground hover:text-primary transition-colors">
                    Equipo
                  </Link>
                  <Link href="/#nosotros" className="text-muted-foreground hover:text-primary transition-colors">
                    Nosotros
                  </Link>
                  <Link href="/#contacto" className="text-muted-foreground hover:text-primary transition-colors">
                    Contacto
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
              </>
            )}
          </div>

        {!isAdmin && isMenuOpen && (
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
                href="/#contacto" 
                className="text-muted-foreground hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contacto
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
