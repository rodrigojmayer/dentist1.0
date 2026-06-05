"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, User as UserIcon, LogOut, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProfessionalContext } from "@/context/professionalsContext"
import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { LoginAdminButton } from "./loginButton"

// Importamos los nuevos subcomponentes
import { HeaderAdminNavigation } from "./HeaderAdminNavigation"
import { HeaderPublicNavigation } from "./HeaderPublicNavigation"
import { HeaderUserMenu } from "./HeaderUserMenu"

interface HeaderProps {
  isAdminPage?: boolean
}

export function Header({ isAdminPage = false }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [userProfile, setUserProfile] = useState<{ role: string } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()

  const isGestionTurnosActive = pathname === "/admin"
  const { professionals, loading: loadingPros } = useProfessionalContext()

  // Manejo de Sesión de Supabase
  useEffect(() => {
    // 1. Función para ir a buscar el rol a la tabla de perfiles personalizados
    const fetchProfile = async (userId: string) => {
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()
      setUserProfile(data)
    }

    // 2. Tu checkSession original (Verificación rápida inicial al cargar la página)
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        await fetchProfile(user.id) // 👈 Si hay usuario, buscamos su rol al toque
      }
      setLoadingUser(false)
    }
    checkSession()

    // 3. El oyente de Supabase (Escucha si el usuario inicia o cierra sesión más adelante)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null
      setUser(currentUser)
      
      if (currentUser) {
        await fetchProfile(currentUser.id) // 👈 Si el estado de auth cambia (ej: se loguea), buscamos el rol
      } else {
        setUserProfile(null) // Si desloguea, limpiamos el perfil
      }
      setLoadingUser(false)
    })

    return () => subscription.unsubscribe()
  }, [supabase])

  // Click Outside para cerrar dropdowns
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
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-b border-border ${isAdminPage ? "bg-foreground" : "bg-background/95"} w-screen`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex items-center justify-between h-16 md:h-20">
            
            {/* Logo e Identidad */}
            <Link href="/" className="flex items-center gap-2 z-10">
              <img src="/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview8.png" className="h-15 w-auto object-contain block pb-2"/>
              <span className={`font-serif text-xl md:text-2xl font-semibold ${isAdminPage ? "text-background/95" : "text-foreground"}`}>
                Instituto Odontológico Austral
              </span>
            </Link>

            {isAdminPage && (
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block z-10">
                <span className="text-muted-foreground font-medium text-xs md:text-sm tracking-wide bg-muted px-3 py-1.5 rounded-full border border-border/50 whitespace-nowrap">
                  Panel de Administración
                </span>
              </div>
            )}

            {/* ZONA DE NAVEGACIÓN (Condicional limpia con subcomponentes) */}
            <div className="flex items-center gap-8" ref={dropdownRef}>
              {isAdminPage ? (
                <HeaderAdminNavigation 
                  isGestionTurnosActive={isGestionTurnosActive}
                  isDropdownOpen={isDropdownOpen}
                  setIsDropdownOpen={setIsDropdownOpen}
                  loadingPros={loadingPros}
                  professionals={professionals}
                  handleProfessionalSelect={handleProfessionalSelect}
                />
              ) : (
                <HeaderPublicNavigation />
              )}

              {/* Acciones de Login y Botón de Reserva */}
              <div className="hidden md:flex items-center gap-4">
                {!isAdminPage && (
                  <Link href="/reservar">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                      Reservar turno
                    </Button>
                  </Link>
                )}
                
                <HeaderUserMenu 
                  user={user}
                  role={userProfile?.role}
                  loadingUser={loadingUser}
                  isAdminPage={isAdminPage}
                  setIsLoginModalOpen={setIsLoginModalOpen}
                  handleLogout={handleLogout}
                />
              </div>

              {/* Hamburguesa Móvil */}
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

        {/* Menú móvil (Se mantiene acá por simplicidad de estados locales del responsive) */}
        {!isAdminPage && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border bg-background px-4">
            <nav className="flex flex-col gap-4">
              <Link href="/#equipo" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Equipo</Link>
              <Link href="/#nosotros" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
              <Link href="/#contacto" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
              <Link href="/#servicios" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
              
              {!loadingUser && !user && (
                <div className="flex flex-col gap-2 pt-2 border-t border-border">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    onClick={() => { setIsMenuOpen(false); setIsLoginModalOpen(true); }}
                  >
                    <UserIcon className="h-4 w-4" />
                    Ingresar / Registrarse
                  </Button>
                </div>
              )}

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
                <Button className="w-full bg-primary text-primary-foreground">
                  Reservar turno
                </Button>
              </Link>
            </nav>
          </div>
        )}
      </header>

      {/* Modal Central de Autenticación */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-[420px] p-0 overflow-hidden bg-background border-border">
          <DialogHeader className="pt-6 px-6">
            <DialogTitle className="text-xl font-semibold text-center font-serif">
              Ingresar al Portal
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Iniciá sesión para gestionar tus turnos en el Instituto.
            </DialogDescription>
          </DialogHeader>
          <div className="pb-4">
            <LoginAdminButton />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}