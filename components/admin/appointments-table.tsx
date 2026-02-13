"use client"

import { Check, X, Trash2, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import type { Appointment } from "@/lib/types"
import { professionals, locations } from "@/lib/types"
import { cn } from "@/lib/utils"

interface AppointmentsTableProps {
  appointments: Appointment[]
  onStatusChange: (id: string, status: "confirmed" | "cancelled" | "deleted") => void
  onDelete: (id: string) => void
}

const statusConfig = {
  pending: { label: "Pendiente", variant: "secondary" as const, className: "bg-amber-100 text-amber-800" },
  confirmed: { label: "Confirmado", variant: "secondary" as const, className: "bg-green-100 text-green-800" },
  cancelled: { label: "Cancelado", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
  deleted: { label: "Deleted", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
}

export function AppointmentsTable({ appointments, onStatusChange, onDelete }: AppointmentsTableProps) {
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

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-muted/50">
          <tr>
            <th className="text-left p-4 font-medium text-muted-foreground text-sm">Paciente</th>
            <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden md:table-cell">Contacto</th>
            <th className="text-left p-4 font-medium text-muted-foreground text-sm">Profesional</th>
            <th className="text-left p-4 font-medium text-muted-foreground text-sm hidden lg:table-cell">Sucursal</th>
            <th className="text-left p-4 font-medium text-muted-foreground text-sm">Fecha/Hora</th>
            <th className="text-left p-4 font-medium text-muted-foreground text-sm">Estado</th>
            <th className="text-right p-4 font-medium text-muted-foreground text-sm">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {appointments.map((appointment) => (
            <tr key={appointment.id} className="hover:bg-muted/30 transition-colors">
              <td className="p-4">
                <div className="font-medium text-foreground">{appointment.patientName}</div>
                <div className="text-sm text-muted-foreground md:hidden">
                  {appointment.patientPhone}
                </div>
              </td>
              <td className="p-4 hidden md:table-cell">
                <div className="text-sm text-foreground">{appointment.patientEmail}</div>
                <div className="text-sm text-muted-foreground">{appointment.patientPhone}</div>
              </td>
              <td className="p-4">
                <div className="text-sm text-foreground">{getProfessionalName(appointment.professionalId)}</div>
              </td>
              <td className="p-4 hidden lg:table-cell">
                <div className="text-sm text-foreground">{getLocationName(appointment.locationId)}</div>
              </td>
              <td className="p-4">
                <div className="text-sm text-foreground">{formatDate(appointment.date)}</div>
                <div className="text-sm text-muted-foreground">{appointment.time}</div>
              </td>
              <td className="p-4">
                <Badge 
                  variant={statusConfig[appointment.status].variant}
                  className={cn(statusConfig[appointment.status].className)}
                >
                  {statusConfig[appointment.status].label}
                </Badge>
              </td>
              <td className="p-4 text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0  cursor-pointer">
                      <MoreHorizontal className="h-4 w-4" />
                      <span className="sr-only">Abrir menu</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
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
      </table>
    </div>
  )
}
