"use client"

import { CheckCircle, Calendar, Clock, MapPin, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { Appointment } from "@/lib/types"
import { professionals, locations } from "@/lib/types"

interface ConfirmationStepProps {
  appointment: Appointment
  onNewBooking: () => void
}

export function ConfirmationStep({ appointment, onNewBooking }: ConfirmationStepProps) {
  const professional = professionals.find(p => p.id === appointment.professionalId)
  const location = locations.find(l => l.id === appointment.locationId)

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div className="text-center py-8">
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-100 flex items-center justify-center">
        <CheckCircle className="h-10 w-10 text-green-600" />
      </div>

      <h2 className="text-2xl font-semibold text-foreground mb-2">
        Turno confirmado
      </h2>
      <p className="text-muted-foreground mb-8">
        Hemos registrado tu turno exitosamente
      </p>

      <div className="bg-secondary rounded-lg p-6 mb-8 text-left max-w-md mx-auto">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Sucursal</p>
              <p className="font-medium text-foreground">{location?.city} - {location?.address}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Profesional</p>
              <p className="font-medium text-foreground">{professional?.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Fecha</p>
              <p className="font-medium text-foreground">{formatDate(appointment.date)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="h-5 w-5 text-primary flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">Hora</p>
              <p className="font-medium text-foreground">{appointment.time}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Codigo de reserva: <span className="font-mono font-medium text-foreground">{appointment.id}</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button
          variant="outline"
          onClick={onNewBooking}
        >
          Reservar otro turno
        </Button>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground w-full sm:w-auto">
            Volver al inicio
          </Button>
        </Link>
      </div>
    </div>
  )
}
