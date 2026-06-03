"use client"

import { useState, useEffect, useCallback } from "react"
import { Sun, Calendar, Users, Clock, RefreshCw, UserCircle, ChevronRight } from "lucide-react"
// import { professionals } from "@/lib/types"
import { useProfessionalContext } from "@/context/professionalsContext"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentsTable } from "./appointments-table"
import { AppointmentFilters } from "./appointment-filters"
import type { Appointment } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAppointments } from "@/hooks/use-appointments"
import { Header } from "@/components/header" // <--- Importás tu Header real acá (ajustá la ruta si hace falta)
import { cn } from "@/lib/utils"


export function AdminDashboard() {
  const { professionals, loading: loadingPros } = useProfessionalContext()
  const { toast } = useToast() // <--- Agregá esta línea al principio
  // const [appointments, setAppointments] = useState<Appointment[]>([])
  // const today = new Date();
  // Obtenemos la fecha de hoy en formato local YYYY-MM-DD sin desfasajes de zona horaria
  const todayStr = new Date().toLocaleDateString("sv-SE") // Retorna "YYYY-MM-DD" basado en tu zona local
  const [loading, setLoading] = useState(true)
  // MODIFICADO: Ahora 'date' es un objeto con rangos 'from' y 'to' (Ambos inician con HOY)
  const [statusFilter, setStatusFilter] = useState("all")
  
  const {
    appointments,
    setAppointments,
    handleStatusChange,
    handleDelete
  } = useAppointments()

  const [filters, setFilters] = useState({
    status: "all",
    // date: today.toISOString().split('T')[0],
    date: {
      from: todayStr,
      to: todayStr,
    }
  })

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch("/api/appointments")
      const data = await response.json()
      setAppointments(data.appointments || [])
    } catch (error) {
      console.error("Error fetching appointments:", error)
    } finally {
      setLoading(false)
    }
  }, [setAppointments])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  // const handleStatusChange = async (id: string, status: "confirmed" | "cancelled" | "deleted") => {
  //   try {
  //     console.log("status: ", status)
  //     const response = await fetch(`/api/appointments/${id}`, {
  //       method: "PATCH",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ status })
  //     })
      
  //     if (response.ok) {
  //       setAppointments(prev => {
  //         if (status === "deleted") {
  //                 return prev.filter(apt => apt.id !== id);
  //               }
  //         return prev.map(apt => apt.id === id ? { ...apt, status } : apt)
  //       }
  //       )
  //       toast({
  //     title: status === "deleted" ? "Turno eliminado" : "Estado actualizado",
  //     description: `El turno ha sido marcado como ${status}.`,
  //   });
  //     }
  //   } catch (error) {
  //     console.error("Error updating appointment:", error)
  //   }
  // }

  // const handleDelete = async (id: string) => {
  //   if (!confirm("Esta seguro de eliminar este turno?")){
      

  //     return
  //   } 
  //     handleStatusChange(id, "deleted")
  //   // try {
  //   //   const response = await fetch(`/api/appointments/${id}`, {
  //   //     method: "DELETE"
  //   //   })
      
  //   //   if (response.ok) {
  //   //     setAppointments(prev => prev.filter(apt => apt.id !== id))
  //   //   }
  //   // } catch (error) {
  //   //   console.error("Error deleting appointment:", error)
  //   // }
  // }

  // MODIFICADO: Lógica de filtrado por rango inclusivo (Desde / Hasta)
  const filteredAppointments = appointments.filter(apt => {
    if (filters.status !== "all" && apt.status !== filters.status) return false
    
    // if (filters.date && apt.date !== filters.date) return false
    
    // Si hay fecha "desde", el turno debe ser igual o posterior
    if (filters.date.from && apt.date < filters.date.from) return false
    
    // Si hay fecha "hasta", el turno debe ser igual o anterior
    if (filters.date.to && apt.date > filters.date.to) return false

    return true
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    deleted: appointments.filter(a => a.status === "deleted").length,
    // today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
    today: appointments.filter(a => a.date === todayStr).length,
  }

  return (
    // <div className="min-h-screen bg-background">
    <div className="min-h-screen bg-background pt-20 md:pt-24">
      {/* <header className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <img src="/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview8.png" className="h-15 w-auto object-contain block pb-2"/>
               <span className="font-serif text-xl font-semibold">Instituto Odontológico Austral</span>
            </Link>
            <span className="text-background/70 text-sm">Panel de Administracion</span>
          </div>
        </div>
      </header> */}
      <Header isAdminPage={true} />
      {/* <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion de Turnos</h1>
            <p className="text-muted-foreground">Administra las citas de los pacientes</p>
          </div>
          <Button onClick={fetchAppointments} variant="outline" className="gap-2 bg-transparent cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div> */}

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
      {/* Título y Sección Superior */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Gestion de Turnos</h1>
          <p className="text-muted-foreground text-sm">Administra las citas de los pacientes</p>
        </div>

        {/* Bloque Derecho: Calendario Semanal por Profesional */}
        
        
      </div>

      {/* BARRA INTERACTIVA: Filtros + Contadores Dinámicos */}
      <div className="flex flex-col md:flex-row md:items-center gap-4 pb-0 mb-0">
        
        {/* Componente de Filtros (Fechas desde/hasta se renderizan acá adentro) */}
        <div className="w-full md:w-115 shrink-0">
          <AppointmentFilters filters={filters} onFiltersChange={setFilters} />
        </div>

  
        {/* Contadores Compactos Dinámicos (Leen de filteredAppointments) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full flex-1">
          {(() => {
            // 1. Definimos la configuración de cada tarjeta
            const cardsConfig = [
              {
                id: "all",
                label: "Total turnos",
                value: filteredAppointments.length,
                icon: <Calendar className="h-3.5 w-3.5 text-primary shrink-0" />,
              },
              {
                id: "pending",
                label: "Pendientes",
                value: filteredAppointments.filter(a => a.status === "pending").length,
                icon: <Clock className="h-3.5 w-3.5 text-amber-500 shrink-0" />,
              },
              {
                id: "confirmed",
                label: "Confirmados",
                value: filteredAppointments.filter(a => a.status === "confirmed").length,
                icon: <Users className="h-3.5 w-3.5 text-green-500 shrink-0" />,
              },
              {
                id: "cancelled",
                label: "Cancelados",
                value: filteredAppointments.filter(a => a.status === "cancelled").length,
                icon: <span className="text-red-500 font-bold text-sm leading-none px-0.5 shrink-0">✕</span>,
              },
            ]

            // 2. Las renderizamos de forma limpia con un solo .map()
            return cardsConfig.map((card) => (
              <Card 
                key={card.id} 
                onClick={() => setStatusFilter(card.id)}
                className={cn(
                  "shadow-sm  py-2 mb-4 border border-border/80 min-w-[110px] cursor-pointer hover:border-primary ",
                  statusFilter === card.id
                    ? "border-primary bg-primary/5 ring-1 ring-primary/20 shadow-md scale-[1.02]" // Seleccionada
                    : "border-border/80 hover:border-primary text-muted-foreground hover:text-foreground" // No seleccionada
                )}
              >
                <CardContent className="px-2 py-0 flex flex-col items-center justify-center">
                  <p className="text-[14px] font-medium text-muted-foreground text-center tracking-tight leading-tight">
                    {card.label}
                  </p>
                  <div className="flex items-center justify-center gap-1.5 mt-0">
                    {card.icon}
                    <span className="text-base font-bold tracking-tight text-foreground">
                      {card.value}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))
          })()}
        </div>
      </div>

        {/* Stats */}
        {/* <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total turnos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{stats.total}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pendientes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-amber-500" />
                <span className="text-2xl font-bold text-foreground">{stats.pending}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmados</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-green-500" />
                <span className="text-2xl font-bold text-foreground">{stats.confirmed}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Hoy</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold text-foreground">{stats.today}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Calendarios por Profesional
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loadingPros ? (
              <div className="text-sm text-muted-foreground p-2">Cargando profesionales...</div>
            ) : !Array.isArray(professionals) || professionals.length === 0 ? (
              <div className="text-sm text-muted-foreground p-2">No se encontraron profesionales.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {professionals.map((professional) => (
                  <Link
                    key={professional.id}
                    href={`/admin/${professional.id}`}
                    className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground group-hover:text-primary transition-colors">
                        {professional.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {professional.specialties[0]}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card> */}

        {/* Sección de Métricas y Calendario Rápido */}
        {/*<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6 items-start">
          
           <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Card className="shadow-sm border border-border/60">
              <CardContent className="px-3 flex flex-col justify-between min-h-[15px]">
                <p className="text-xs font-medium text-muted-foreground tracking-tight">Total turnos</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xl font-bold tracking-tight text-foreground">{stats.total}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border/60">
              <CardContent className="p-3 flex flex-col justify-between min-h-[85px]">
                <p className="text-xs font-medium text-muted-foreground tracking-tight">Pendientes</p>
                <div className="flex items-center gap-2 mt-1">
                  <Clock className="h-4 w-4 text-amber-500 shrink-0" />
                  <span className="text-xl font-bold tracking-tight text-foreground">{stats.pending}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border/60">
              <CardContent className="p-3 flex flex-col justify-between min-h-[85px]">
                <p className="text-xs font-medium text-muted-foreground tracking-tight">Confirmados</p>
                <div className="flex items-center gap-2 mt-1">
                  <Users className="h-4 w-4 text-green-500 shrink-0" />
                  <span className="text-xl font-bold tracking-tight text-foreground">{stats.confirmed}</span>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-sm border border-border/60">
              <CardContent className="p-3 flex flex-col justify-between min-h-[85px]">
                <p className="text-xs font-medium text-muted-foreground tracking-tight">Hoy</p>
                <div className="flex items-center gap-2 mt-1">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-xl font-bold tracking-tight text-foreground">{stats.today}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-sm border border-border/60 bg-card">
              <CardContent className="p-3">
                <div className="flex items-center gap-2 mb-2">
                  <UserCircle className="h-4 w-4 text-primary shrink-0" />
                  <p className="text-xs font-semibold text-foreground tracking-tight">
                    Calendario semanal por Profesional
                  </p>
                </div>

                {loadingPros ? (
                  <div className="text-xs text-muted-foreground py-1">Cargando...</div>
                ) : !Array.isArray(professionals) || professionals.length === 0 ? (
                  <div className="text-xs text-muted-foreground py-1">Sin datos.</div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/${professionals[0].id}`}
                      className="flex-1 flex items-center justify-between p-2 rounded-md border border-border bg-background hover:border-primary hover:bg-primary/5 transition-colors text-left"
                    >
                      <div className="truncate">
                        <p className="text-xs font-medium text-foreground truncate">{professionals[0].name}</p>
                        <p className="text-[10px] text-muted-foreground truncate">{professionals[0].specialties[0]}</p>
                      </div>
                      <ChevronRight className="h-3 w-3 text-muted-foreground shrink-0 ml-1" />
                    </Link>
                    
                    <Link href={`/admin/${professionals[0].id}`}>
                      <Button size="sm" className="h-9 text-xs px-3 font-medium cursor-pointer">
                        Ir
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div> */}

        {/* Filters */}
        {/* <AppointmentFilters filters={filters} onFiltersChange={setFilters} /> */}

        {/* Table */}
        <Card className="border-none shadow-none bg-transparent p-0">
          <CardContent className="p-0">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">
                Cargando turnos...
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                No hay turnos registrados
              </div>
            ) : (
              <AppointmentsTable 
                appointments={filteredAppointments}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
