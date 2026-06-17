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
import { HeaderUserConfigModal } from "./HeaderUserConfigModal"

interface HeaderProps {
  isAdminPage?: boolean
}

export function Header({ isAdminPage = false }: HeaderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<{ role: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const supabase = createClient()
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false)
  
  const isGestionTurnosActive = pathname === "/admin"
  const { professionals, loading: loadingPros } = useProfessionalContext()

  // Manejo de Sesión de Supabase
  useEffect(() => {
  let isMounted = true; // Evita fugas de memoria y cambios de estado en componentes desmontados

  // Centralizamos la carga del perfil
  const loadUserData = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
      
      if (error) throw error;
      
      if (isMounted) {
        setUserProfile(data);
      }
    } catch (error) {
      console.error("Error cargando el perfil en Header:", error);
      if (isMounted) setUserProfile(null);
    } finally {
      if (isMounted) setIsLoading(false);
    }
  };

  // Inicialización rápida al montar/recargar
  const initSession = async () => {
    if (isMounted) setIsLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        await loadUserData(user.id);
      } else {
        if (isMounted) {
          setUser(null);
          setUserProfile(null);
          setIsLoading(false);
        }
      }
    } catch (err) {
      console.error("Error en initSession:", err);
      if (isMounted) setIsLoading(false);
    }
  };

  initSession();

  // Escuchador de cambios de estado (Login / Logout / Token Refresh)
  const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
    // Si es la carga inicial, la ignoramos porque ya la maneja initSession arriba
    if (event === 'INITIAL_SESSION') return;

    const currentUser = session?.user ?? null;

    if (isMounted) {
      setUser(currentUser);
    }

    if (currentUser) {
      // Si se logueó, traemos el perfil sin clavar un "isLoading" rudo
      // para que pase de Invitado a Usuario de forma limpia
      loadUserData(currentUser.id);
    } else {
      if (isMounted) {
        setUserProfile(null);
        setIsLoading(false);
      }
    }
  });

  return () => {
    isMounted = false;
    subscription.unsubscribe();
  };
}, [supabase]);

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
          <div className="relative flex items-center justify-between h-16 min-[1010px]:h-20">
            
            {/* Logo e Identidad */}
            <Link href="/" className="flex items-center gap-2 z-10">
              <img src="/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview8.png" className="h-15 w-auto object-contain block pb-2"/>
              <span className={`font-serif text-xl min-[1010px]:text-2xl font-semibold ${isAdminPage ? "text-background/95" : "text-foreground"}`}>
                Instituto Odontológico Austral
              </span>
            </Link>

            {isAdminPage && (
              // <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 hidden lg:block z-10">
                <span className="text-muted font-medium text-xs md:text-sm tracking-wide bg-primary m-3 px-3 py-1.5 rounded-full border border-border/50 whitespace-nowrap">
                  Panel de Administración
                </span>
              //  </div>
            )}

            {/* Hamburguesa Móvil */}
            <button
              type="button"
              className={`min-[1010px]:hidden p-2 z-10 rounded-md transition-colors cursor-pointer ${
                isAdminPage ? "text-background/95 hover:bg-background/10" : "text-foreground hover:bg-muted"
              }`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>


            {/* ZONA DE NAVEGACIÓN (Condicional limpia con subcomponentes) */}
            <div className="hidden min-[1010px]:flex items-center gap-8" ref={dropdownRef}>
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
              <div className="flex items-center gap-4">
                {!isAdminPage && (
                  <Link href="/reservar">
                    <Button className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
                      Reservar turno
                    </Button>
                  </Link>
                )}
                
                <div className="w-48 flex justify-end">
                  {isLoading ? (
                    /* 🕒 ESQUELETO ADAPTATIVO CON ICONO */
                    <div className={`flex items-center gap-2 px-3 h-10 w-full justify-start animate-pulse rounded-md border border-transparent ${
                      isAdminPage ? "bg-background/10" : "bg-muted/20"
                    }`}>
                      {/* Contenedor del Icono (Reemplaza al círculo vacío) */}
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isAdminPage 
                          ? "bg-background/20 text-background/50" 
                          : "bg-primary/10 text-primary/50"
                      }`}>
                        <UserIcon className="h-4 w-4" />
                      </div>
                      
                      {/* Barra de Texto */}
                      <div className={`w-24 h-4 rounded ${
                        isAdminPage ? "bg-background/20" : "bg-muted"
                      }`} />
                    </div>
                  ) : (
                    <HeaderUserMenu 
                      user={user}
                      role={userProfile?.role}
                      isAdminPage={isAdminPage}
                      setIsLoginModalOpen={setIsLoginModalOpen}
                      setIsConfigModalOpen={setIsConfigModalOpen}
                      handleLogout={handleLogout}
                    />
                  )}
                </div>
              </div>

              
            </div>

          </div>
        </div>

        {/* Menú móvil (Se mantiene acá por simplicidad de estados locales del responsive) */}
        {!isAdminPage && isMenuOpen && (
          <div className="min-[1010px]:hidden py-4 border-t border-border bg-background px-4">
            <nav className="flex flex-col gap-4">
              <Link href="/#nosotros" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Nosotros</Link>
              <Link href="/#equipo" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Equipo</Link>
              <Link href="/#servicios" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Servicios</Link>
              <Link href="/#contacto" className="text-muted-foreground" onClick={() => setIsMenuOpen(false)}>Contacto</Link>
              
              {!isLoading && !user && (
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
                  <Button 
                    variant="outline" 
                    className="w-full justify-start gap-2" 
                    onClick={() => { setIsMenuOpen(false); setIsConfigModalOpen(true); }}
                  >
                    <Settings className="h-4 w-4" /> Configurar usuario
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

      <HeaderUserConfigModal 
        isOpen={isConfigModalOpen} 
        onOpenChange={setIsConfigModalOpen} 
        user={user} 
      />
    </>
  )
}