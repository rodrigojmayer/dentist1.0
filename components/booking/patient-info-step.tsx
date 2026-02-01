"use client"

import { useState } from "react"
import { ArrowLeft, User, Mail, Phone, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { BookingData } from "./booking-form"
import { professionals, locations } from "@/lib/types"

interface PatientInfoStepProps {
  data: BookingData
  onUpdate: (updates: Partial<BookingData>) => void
  onSubmit: () => Promise<void>
  onBack: () => void
}

export function PatientInfoStep({ data, onUpdate, onSubmit, onBack }: PatientInfoStepProps) {
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const professional = professionals.find(p => p.id === data.professionalId)
  const location = locations.find(l => l.id === data.locationId)

  const validate = () => {
    const newErrors: Record<string, string> = {}
    
    if (!data.patientName.trim()) {
      newErrors.patientName = "El nombre es obligatorio"
    }
    
    if (!data.patientEmail.trim()) {
      newErrors.patientEmail = "El email es obligatorio"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.patientEmail)) {
      newErrors.patientEmail = "Email invalido"
    }
    
    if (!data.patientPhone.trim()) {
      newErrors.patientPhone = "El telefono es obligatorio"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    
    setLoading(true)
    try {
      await onSubmit()
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-')
    return `${day}/${month}/${year}`
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      <h2 className="text-xl font-semibold text-foreground mb-2">
        Tus datos
      </h2>
      <p className="text-muted-foreground mb-6">
        Completa tus datos para confirmar el turno
      </p>

      {/* Appointment summary */}
      <div className="bg-secondary rounded-lg p-4 mb-6">
        <h3 className="font-medium text-foreground mb-2">Resumen del turno</h3>
        <div className="text-sm text-muted-foreground space-y-1">
          <p><span className="font-medium">Sucursal:</span> {location?.city} - {location?.address}</p>
          <p><span className="font-medium">Profesional:</span> {professional?.name}</p>
          <p><span className="font-medium">Fecha:</span> {formatDate(data.date)}</p>
          <p><span className="font-medium">Hora:</span> {data.time}</p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="patientName" className="flex items-center gap-2 mb-2">
            <User className="h-4 w-4 text-primary" />
            Nombre completo
          </Label>
          <Input
            id="patientName"
            value={data.patientName}
            onChange={(e) => onUpdate({ patientName: e.target.value })}
            placeholder="Tu nombre completo"
            className={errors.patientName ? "border-destructive" : ""}
          />
          {errors.patientName && (
            <p className="text-sm text-destructive mt-1">{errors.patientName}</p>
          )}
        </div>

        <div>
          <Label htmlFor="patientEmail" className="flex items-center gap-2 mb-2">
            <Mail className="h-4 w-4 text-primary" />
            Email
          </Label>
          <Input
            id="patientEmail"
            type="email"
            value={data.patientEmail}
            onChange={(e) => onUpdate({ patientEmail: e.target.value })}
            placeholder="tu@email.com"
            className={errors.patientEmail ? "border-destructive" : ""}
          />
          {errors.patientEmail && (
            <p className="text-sm text-destructive mt-1">{errors.patientEmail}</p>
          )}
        </div>

        <div>
          <Label htmlFor="patientPhone" className="flex items-center gap-2 mb-2">
            <Phone className="h-4 w-4 text-primary" />
            Telefono
          </Label>
          <Input
            id="patientPhone"
            type="tel"
            value={data.patientPhone}
            onChange={(e) => onUpdate({ patientPhone: e.target.value })}
            placeholder="Tu numero de telefono"
            className={errors.patientPhone ? "border-destructive" : ""}
          />
          {errors.patientPhone && (
            <p className="text-sm text-destructive mt-1">{errors.patientPhone}</p>
          )}
        </div>

        <div>
          <Label htmlFor="notes" className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-primary" />
            Notas adicionales (opcional)
          </Label>
          <Textarea
            id="notes"
            value={data.notes}
            onChange={(e) => onUpdate({ notes: e.target.value })}
            placeholder="Motivo de la consulta u otras observaciones"
            rows={3}
          />
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {loading ? "Confirmando..." : "Confirmar turno"}
        </Button>
      </div>
    </div>
  )
}
