"use client"

import { useState } from "react"
import { Check, X, Trash2, MoreHorizontal, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Appointment } from "@/lib/types"
// import { professionals, locations } from "@/lib/types"
import { useProfessionalContext } from "@/context/professionalsContext"
import { locations } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { AppointmentDetailDialog } from "@/components/admin/appointment-detail-dialog"

interface AppointmentsTableProps {
  appointments: Appointment[]
  statusFilter: string
  setStatusFilter: (status: string) => void
  onStatusChange: (id: string, status: "confirmed" | "cancelled" | "deleted") => void
  onDelete: (id: string) => void
  onAppointmentsUpdate?: (updatedAppointments: Appointment[]) => void
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const, className: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmado", variant: "secondary" as const, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
  deleted: { label: "Eliminado", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
}

export function AppointmentsTable({ 
  appointments, 
  statusFilter, 
  setStatusFilter,
  onStatusChange, 
  onDelete, 
  onAppointmentsUpdate }: AppointmentsTableProps) {
  const { professionals, loading: loadingPros } = useProfessionalContext()
  
  // 1. Estados independientes para cada filtro de columna
  const [patientFilter, setPatientFilter] = useState("")
  const [professionalFilter, setProfessionalFilter] = useState("all")
  const [locationFilter, setLocationFilter] = useState("all")
  // const [statusFilter, setStatusFilter] = useState("all")
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  const getProfessionalName = (id: string) => {
    return professionals.find(p => p.id === id)?.name || id
  }

  const getLocationName = (id: string) => {
    return locations.find(l => l.id === id)?.city || id
  }

  // 2. Filtrado en cascada por cada columna activa
  const filteredAppointments = appointments.filter((apt) => {
    // Filtro por Paciente (Nombre, Email o Teléfono)
    if (patientFilter) {
      const search = patientFilter.toLowerCase()
      const matchesName = apt.patientName?.toLowerCase().includes(search)
      const matchesEmail = apt.patientEmail?.toLowerCase().includes(search)
      const matchesPhone = apt.patientPhone?.toLowerCase().includes(search)
      if (!matchesName && !matchesEmail && !matchesPhone) return false
    }

    // Filtro por Profesional
    if (professionalFilter !== "all" && apt.professionalId !== professionalFilter) return false
    // Filtro por Sucursal
    if (locationFilter !== "all" && apt.locationId !== locationFilter) return false
    // Filtro por Estado
    if (statusFilter !== "all" && apt.status !== statusFilter) return false

    return true
  })

  // Función para sincronizar los cambios de estado que se hagan DENTRO del Dialog con la lista de la tabla
  const handleLocalDialogUpdate = (updatedApt: Appointment) => {
    setSelectedAppointment(updatedApt)
    if (onAppointmentsUpdate) {
      const updatedList = appointments.map(apt => apt.id === updatedApt.id ? updatedApt : apt)
      onAppointmentsUpdate(updatedList)
    }
  }

  return (
    <div className="overflow-x-auto w-full rounded-lg border border-border bg-background min-h-[calc(90vh)] flex flex-col justify-between">
      <div className="flex-1">
        <table className="w-full text-left border-collapse table-fixed">
          <thead className="bg-slate-400 border-b border-border text-white">
            <tr>
              <th className="text-center pt-2 font-medium  text-sm w-[17%] cursor-pointer">Paciente</th>
              <th className="text-center pt-2 font-medium  text-sm hidden md:table-cell w-[28%] cursor-pointer">Contacto</th>
              <th className="text-center pt-2 font-medium  text-sm w-[15%] cursor-pointer">Profesional</th>
              <th className="text-center pt-2 font-medium  text-sm hidden lg:table-cell w-[12%] cursor-pointer">Sucursal</th>
              <th className="text-center pt-2 font-medium  text-sm w-[13%] cursor-pointer">Fecha/Hora</th>
              <th className="text-center pt-2 font-medium  text-sm w-[15%] cursor-pointer">Estado</th>
              <th className="text-center pt-2 font-medium  text-sm w-[110px] cursor-pointer">Acciones</th>
            </tr>

            {/* Fila 2: Inputs de Filtros integrados por columna */}
            <tr>
              {/* Filtro Paciente */}
              <td className="px-2  text-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                  <Input
                    placeholder="Buscar paciente..."
                    value={patientFilter}
                    onChange={(e) => setPatientFilter(e.target.value)}
                    className="h-8 pl-8 text-xs text-foreground bg-background max-w-[180px]"
                  />
                </div>
              </td>
              <td className="p-2 text-center hidden md:table-cell">
                <span className="text-xs italic">Búsqueda integrada a la izq.</span>
              </td>
              <td className="px-2 text-center">
                <Select 
                  value={professionalFilter} 
                  onValueChange={(value) => setProfessionalFilter(value)}
                >
                  <SelectTrigger className="h-8 w-full max-w-[160px] text-xs cursor-pointer bg-background text-foreground">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer text-xs">
                      Todos
                    </SelectItem>
                    {professionals.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="cursor-pointer text-xs">
                        {p.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="px-2 text-center hidden lg:table-cell">
                <Select 
                  value={locationFilter} 
                  onValueChange={(value) => setLocationFilter(value)}
                >
                  <SelectTrigger className="h-8 w-full max-w-[160px] text-xs cursor-pointer bg-background text-foreground">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer text-xs">
                      Todas
                    </SelectItem>
                    {locations.map((p) => (
                      <SelectItem key={p.id} value={p.id} className="cursor-pointer text-xs">
                        {p.city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </td>
              <td className="p-0 text-center">
                {/* <span className="text-xs text-muted-foreground/50 italic">Filtrado por rango arriba</span> */}
              </td>
              {/* Filtro Estado */}
              <td className="px-0 text-center">
                {/* <Select 
                  value={statusFilter} 
                  onValueChange={(value) => setStatusFilter(value)}
                >
                  <SelectTrigger className="h-8 w-full max-w-[160px] text-xs cursor-pointer bg-background text-foreground">
                    <SelectValue placeholder="Todos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="cursor-pointer text-xs">
                      Todos
                    </SelectItem>
                    <SelectItem value="pending" className="cursor-pointer text-xs">
                      Pendientes
                    </SelectItem>
                    <SelectItem value="confirmed" className="cursor-pointer text-xs">
                      Confirmados
                    </SelectItem>
                    <SelectItem value="cancelled" className="cursor-pointer text-xs">
                      Cancelados
                    </SelectItem>
                  </SelectContent>
                </Select> */}
              </td>
              {/* Botón de limpiar filtros rápidos */}
              <td className="px-2 text-center pr-4">
                {(patientFilter || professionalFilter !== "all" || locationFilter !== "all" || statusFilter !== "all") && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setPatientFilter("")
                      setProfessionalFilter("all")
                      setLocationFilter("all")
                      setStatusFilter("all")
                    }}
                    className="h-7 text-[11px]  hover:text-white bg-destructive/40 hover:bg-destructive/70 px-2 cursor-pointer"
                  >
                    Limpiar
                  </Button>
                )}
              </td>
            </tr>
          </thead>

          {/* Solo renderizamos el tbody si hay elementos */}
          {filteredAppointments.length > 0 && (
            <tbody className="divide-y divide-border cursor-pointer">
              {/* 3. Mapeamos el array ya filtrado por las columnas */}
              {filteredAppointments.map((appointment) => (
                <tr 
                  key={appointment.id} 
                  onClick={() => setSelectedAppointment(appointment)}
                  className="border-b border-border odd:bg-white even:bg-blue-50  odd:hover:bg-black/[0.1] even:hover:bg-blue-200 transition-colors"
                >
                  <td className="p-4 text-center">
                    <div className="font-medium text-foreground">{appointment.patientName}</div>
                    <div className="text-sm text-muted-foreground md:hidden">
                      {appointment.patientPhone}
                    </div>
                  </td>
                  <td className="p-4 hidden text-center md:table-cell max-w-0">
                    <div className="text-sm text-foreground truncate overflow-hidden">{appointment.patientEmail}</div>
                    <div className="text-sm text-muted-foreground truncate overflow-hidden">{appointment.patientPhone}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-sm text-foreground">{getProfessionalName(appointment.professionalId)}</div>
                  </td>
                  <td className="p-4 text-center hidden lg:table-cell">
                    <div className="text-sm text-foreground">{getLocationName(appointment.locationId)}</div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="text-sm text-foreground">{formatDate(appointment.date)}</div>
                    <div className="text-sm text-muted-foreground">{appointment.time}</div>
                  </td>
                  <td className="p-4 text-center">
                    <Badge 
                      variant={statusConfig[appointment.status].variant}
                      className={cn(statusConfig[appointment.status].className)}
                    >
                      {statusConfig[appointment.status].label}
                    </Badge>
                  </td>
                  <td className="p-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0  cursor-pointer">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="z-1">
                        {appointment.status !== "confirmed" && (
                          <DropdownMenuItem onClick={() => onStatusChange(appointment.id, "confirmed")}>
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Confirmar
                          </DropdownMenuItem>
                        )}
                        {appointment.status !== "cancelled" && (
                          <DropdownMenuItem onClick={() => onStatusChange(appointment.id, "cancelled")}>
                            <X className="h-4 w-4 mr-2 text-amber-600" />
                            Cancelar
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => onDelete(appointment.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>

        {/* 2. SI LA TABLA QUEDA VACÍA: Renderizamos un cartel centrado sin colapsar la pantalla */}
        {filteredAppointments.length === 0 && (
           <div className="flex flex-col items-center justify-center py-32 text-center animate-fade-in">
          {/* <div className="flex flex-col items-center justify-center min-h-[calc(100vh-400px)] text-center animate-fade-in"> */}
           
           {/* <div className="flex flex-col items-center justify-center h-[calc(100vh-320px)] text-center animate-fade-in"> */}
            <div className="rounded-full bg-muted p-3 mb-3">
              <Search className="h-6 w-6 text-muted-foreground/60" />
            </div>
            <p className="text-sm font-medium text-foreground">No se encontraron turnos</p>
            <p className="text-xs text-muted-foreground max-w-[280px] mt-1">
              Probá modificando los filtros por columna o el rango de fechas seleccionado arriba.
            </p>
          </div>
        )}
      </div>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={onStatusChange as any}
        onDelete={onDelete}
        onUpdateLocalState={handleLocalDialogUpdate}
      />
    </div>
  )
}
