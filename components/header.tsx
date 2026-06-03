"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, ChevronDown, User as UserIcon, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfessionalContext } from "@/context/professionalsContext"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client" // 👈 Ajustá esta ruta a tu inicializador de Supabase
import { type User } from "@supabase/supabase-js"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { prependListener } from "process"

interface HeaderProps {
  isAdmin?: boolean
}

export function Header({ isAdmin = false }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  // Evaluamos en qué sección del admin estamos parados
  const isGestionTurnosActive = pathname === "/admin"
  const isAgendaSemanalActive = pathname.startsWith("/admin/")

  // Consumimos los profesionales directamente del contexto global
  const { professionals, loading: loadingPros } = useProfessionalContext()

  // Controlar el estado de la sesión de Supabase
  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoadingUser(false)
    }
    checkSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoadingUser(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

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

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.refresh()
    router.push("/")
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

          {/* Navegación y Login */}
          <div className="flex items-center gap-8">
            {isAdmin ? (
              <nav className="hidden md:flex items-center gap-8">
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
                >
                  Gestión turnos
                </Link>
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
            )}

            {/* Espacio Dinámico: Auth Links / User Menu Dropdown */}
            <div className="hidden md:flex items-center gap-4">
              {/* Botón Sacar Turno (Solo visible en Home) */}
              {!isAdmin && (
                <Link href="/reservar">
                  <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                    Reservar turno
                  </Button>
                </Link>
              )}
              {!loadingUser && (
                  /* 🌟 DROPDOWN DE USUARIO LOGUEADO */
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        className={`group cursor-pointer gap-2 font-medium px-3 h-10 focus-visible:ring-0 focus-visible:ring-offset-0 hover:text-primary hover:bg-muted/0 ${
                          isAdmin 
                            ? "text-background " 
                            : "text-foreground"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center ${isAdmin 
                          ? "bg-background/20 text-background group-hover:bg-primary group-hover:text-primary-foreground transition-colors" 
                          : "bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors"}`}>
                          <UserIcon className="h-4 w-4 " />
                        </div>
                        <span className="max-w-[120px] truncate">
                          {user ? (user.user_metadata?.full_name || user.email?.split("@")[0]) : "Invitado" }
                        </span>
                        <ChevronDown className="h-3 w-3 opacity-70" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56 mt-1 z-50">
                      {/* <DropdownMenuLabel className="font-normal flex flex-col gap-0.5">
                        <span className="text-sm font-medium text-foreground truncate">
                          { user ? (user.user_metadata?.full_name || "Usuario") : "" }
                        </span>
                        <span className="text-xs text-muted-foreground truncate">
                          { user ? user && user.email : "" }
                        </span>
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator /> */}
                      <DropdownMenuItem asChild className="cursor-pointer gap-2 text-sm text-foreground">
                        {user ?
                          <Link href="/perfil">
                            <Settings className="h-4 w-4 text-muted-foreground" />
                            Configurar usuario
                          </Link>
                        :
                          <Link href="/login" className="hover:text-foreground transition-colors">
                            Iniciar sesión
                          </Link>
                      }
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      
                        {user ?
                      <DropdownMenuItem 
                        onClick={handleLogout}
                        // className="cursor-pointer gap-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/5"
                          className="data-[highlighted]:bg-destructive/50 data-[highlighted]:text-muted data-[highlighted]:border-destructive/100"
                      >
                        
                            <LogOut className="h-4 w-4 " />
                            Cerrar sesión
                          </DropdownMenuItem>
                        :
                        
                      <DropdownMenuItem 
                        // onClick={handleLogout}
                        // className="cursor-pointer gap-2 text-sm text-destructive focus:text-destructive focus:bg-destructive/5"
                          className="data-[highlighted]:bg-green-50 data-[highlighted]:text-muted data-[highlighted]:border-green-100"
                      >
                          <Link href="/registro" className="hover:text-foreground transition-colors">
                            Crear usuario
                          </Link>
                          </DropdownMenuItem>
                        }
                   
                    </DropdownMenuContent>
                  </DropdownMenu>
              )}
            </div>
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
          {/* Auth Links en Móvil si no está logueado */}
          {!loadingUser && !user && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <Button variant="outline" asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Link href="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild className="w-full" onClick={() => setIsMenuOpen(false)}>
                <Link href="/registro">Crear usuario</Link>
              </Button>
            </div>
          )}

          {/* Si está logueado en móvil, muestra opción rápida de perfil y logout */}
          {user && (
            <div className="flex flex-col gap-2 pt-2 border-t border-border">
              <div className="text-xs text-muted-foreground px-1 truncate">Logueado como: {user.email}</div>
              <Button variant="outline" asChild className="w-full justify-start gap-2" onClick={() => setIsMenuOpen(false)}>
                <Link href="/perfil"><Settings className="h-4 w-4" /> Configurar usuario</Link>
              </Button>
              <Button variant="destructive" className="w-full justify-start gap-2" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </Button>
            </div>
          )}

            <Link href="/reservar" onClick={() => setIsMenuOpen(false)}>
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
                Reservar turno
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
