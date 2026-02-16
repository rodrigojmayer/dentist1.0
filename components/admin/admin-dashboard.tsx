"use client"

import { useState, useEffect, useCallback } from "react"
import { Sun, Calendar, Users, Clock, RefreshCw, UserCircle, ChevronRight } from "lucide-react"
import { professionals } from "@/lib/types"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AppointmentsTable } from "./appointments-table"
import { AppointmentFilters } from "./appointment-filters"
import type { Appointment } from "@/lib/types"
import { useToast } from "@/hooks/use-toast"
import { useAppointments } from "@/hooks/use-appointments"


export function AdminDashboard() {
  const { toast } = useToast() // <--- Agregá esta línea al principio
  // const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    status: "all",
    date: "",
  })

  const {
    appointments,
    setAppointments,
    handleStatusChange,
    handleDelete
  } = useAppointments()

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
  }, [])

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

  const filteredAppointments = appointments.filter(apt => {
    if (filters.status !== "all" && apt.status !== filters.status) return false
    if (filters.date && apt.date !== filters.date) return false
    return true
  })

  const stats = {
    total: appointments.length,
    pending: appointments.filter(a => a.status === "pending").length,
    confirmed: appointments.filter(a => a.status === "confirmed").length,
    deleted: appointments.filter(a => a.status === "deleted").length,
    today: appointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length,
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-foreground text-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <Sun className="h-8 w-8 text-accent" />
              <span className="font-serif text-xl font-semibold">Instituto Odontológico Especializado</span>
            </Link>
            <span className="text-background/70 text-sm">Panel de Administracion</span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Gestion de Turnos</h1>
            <p className="text-muted-foreground">Administra las citas de los pacientes</p>
          </div>
          <Button onClick={fetchAppointments} variant="outline" className="gap-2 bg-transparent cursor-pointer">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
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

        {/* Profesionales */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5 text-primary" />
              Calendarios por Profesional
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>

        {/* Filters */}
        <AppointmentFilters filters={filters} onFiltersChange={setFilters} />

        {/* Table */}
        <Card>
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
