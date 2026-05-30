"use client"

import { Appointment, locations } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Clock, User, Phone, Mail, MapPin, FileText, Stethoscope, Trash2, X, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface AppointmentWithService extends Appointment {
  service?: string
}

interface AppointmentDetailDialogProps {
  appointment: AppointmentWithService | null
  isOpen: boolean
  onClose: () => void
  onStatusChange: (id: string, status: "confirmed" | "pending" | "cancelled" | "deleted") => void
  onDelete: (id: string) => void
  onUpdateLocalState: (updated: AppointmentWithService) => void
}

export function AppointmentDetailDialog({
  appointment,
  isOpen,
  onClose,
  onStatusChange,
  onDelete,
  onUpdateLocalState,
}: AppointmentDetailDialogProps) {
  
  if (!appointment) return null

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.city || locationId
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800"
      case "pending": return "bg-amber-100 text-amber-800"
      case "cancelled": return "bg-red-100 text-red-800"
      default: return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed": return "Confirmado"
      case "pending": return "Pendiente"
      case "cancelled": return "Cancelado"
      default: return status
    }
  }

  
//   pending: { label: "Pendiente", variant: "secondary" as const, className: "bg-amber-100 text-amber-800" },
//   confirmed: { label: "Confirmado", variant: "secondary" as const, className: "bg-green-100 text-green-800" },
//   cancelled: { label: "Cancelado", variant: "secondary" as const, className: "bg-red-100 text-red-800" },
//   deleted: { label: "Eliminado", variant: "secondary" as const, className: "bg-red-100 text-red-800" },

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()} modal={true}>
        {/* <DialogContent className="sm:max-w-md p-5 gap-0"> */}
        <DialogContent className="sm:max-w-md p-3">
            {/* <DialogHeader className="p-0 space-y-0 mb-3"> */}
            <DialogHeader className="p-0 space-y-0 ">
                <DialogTitle className="text-lg font-semibold tracking-tight text-foreground flex items-center justify-between w-full pr-8">
                    <span>Detalle del Turno</span>
                </DialogTitle>
            </DialogHeader>
            
            <div className="flex justify-start">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                    <Badge
                        className={`${getStatusColor(appointment.status)} border-3 cursor-pointer hover:scale-105 transition-transform`}
                    >
                        {getStatusText(appointment.status)}
                    </Badge>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="p-0.5">
                    {appointment.status !== "confirmed" && (
                        <DropdownMenuItem
                            className={cn(
                                "cursor-pointer border border-transparent  transition-colors",
                                "data-[highlighted]:bg-green-100 data-[highlighted]:text-green-800 data-[highlighted]:border-green-400"
                            )}
                            onClick={() => {
                                onStatusChange(appointment.id, "confirmed")
                                onUpdateLocalState({ ...appointment, status: "confirmed" })
                            }}
                        >
                            <Check className="h-4 w-4 mr-2 text-green-600" />
                            Confirmar
                        </DropdownMenuItem>
                    )}

                    {appointment.status !== "cancelled" && (
                        <DropdownMenuItem
                            className={cn(
                              "cursor-pointer border border-transparent  transition-colors",
                              "data-[highlighted]:bg-red-100 data-[highlighted]:text-red-800 data-[highlighted]:border-red-400"
                            )}
                            onClick={() => {
                                onStatusChange(appointment.id, "cancelled")
                                onUpdateLocalState({ ...appointment, status: "cancelled" })
                            }}
                        >
                            <X className="h-4 w-4 mr-2 text-amber-600" />
                            Cancelar
                        </DropdownMenuItem>
                    )}

                    <DropdownMenuItem
                        className={cn(
                            "cursor-pointer border border-transparent text-destructive transition-colors",
                            "data-[highlighted]:bg-destructive/50 data-[highlighted]:text-muted data-[highlighted]:border-destructive/100"
                        )}
                        onClick={() => {
                        onDelete(appointment.id)
                        onClose()
                        }}
                    >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            </div>
            
            <div className="space-y-1">
            {/* Fecha y Hora */}
            <Card className="p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4" />
                    Fecha y Hora
                </div>
                <p className="font-semibold text-sm capitalize">
                    {new Date(appointment.date + "T12:00:00").toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                    })}
                </p>
                <p className="text-lg text-primary font-bold">{appointment.time} hs</p>
            </Card>

            {/* Información del Paciente */}
            <Card className="p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                    <User className="h-4 w-4" />
                    Paciente
                </div>
                <p className="font-semibold text-base">{appointment.patientName}</p>
                <div className="mt-1 space-y-0.5">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-3.5 w-3.5" />
                        <a href={`mailto:${appointment.patientEmail}`} className="hover:text-primary transition-colors">
                        {appointment.patientEmail}
                        </a>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-3.5 w-3.5" />
                        <a href={`tel:${appointment.patientPhone}`} className="hover:text-primary transition-colors">
                        {appointment.patientPhone}
                        </a>
                    </div>
                </div>
            </Card>

            {/* Ubicación y Servicio */}
            <Card className="p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                <Stethoscope className="h-4 w-4" />
                Servicio y Ubicación
                </div>
                <div className="flex flex-col gap-1.5 mt-1">
                {appointment.service && (
                    <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">{appointment.service}</Badge>
                    </div>
                )}
                <div className="flex items-center gap-2 text-sm text-foreground/90">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{getLocationName(appointment.locationId)}</span>
                </div>
                </div>
            </Card>

            {/* Notas */}
            {appointment.notes && (
                <Card className="p-4 shadow-sm">
                <div className="text-sm font-medium text-muted-foreground flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4" />
                    Notas
                </div>
                <p className="text-sm text-foreground/80 bg-muted/40 p-2 rounded mt-1">{appointment.notes}</p>
                </Card>
            )}
            </div>
        </DialogContent>
    </Dialog>
  )
}