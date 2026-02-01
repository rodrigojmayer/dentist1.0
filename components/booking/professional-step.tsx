"use client"

import { User, ArrowLeft } from "lucide-react"
import { professionals } from "@/lib/types"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface ProfessionalStepProps {
  locationId: string
  selectedProfessional: string
  onSelect: (professionalId: string) => void
  onBack: () => void
}

export function ProfessionalStep({ locationId, selectedProfessional, onSelect, onBack }: ProfessionalStepProps) {
  const availableProfessionals = professionals.filter(p => 
    p.availableLocations.includes(locationId)
  )

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
        Selecciona un profesional
      </h2>
      <p className="text-muted-foreground mb-6">
        Elige el odontologo con quien deseas atenderte
      </p>

      <div className="grid gap-4">
        {availableProfessionals.map((professional) => (
          <button
            key={professional.id}
            type="button"
            onClick={() => onSelect(professional.id)}
            className={cn(
              "w-full p-4 rounded-lg border text-left transition-all",
              "hover:border-primary hover:bg-primary/5",
              selectedProfessional === professional.id
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{professional.name}</h3>
                <p className="text-muted-foreground text-sm mt-1">
                  {professional.specialties.join(" - ")}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
