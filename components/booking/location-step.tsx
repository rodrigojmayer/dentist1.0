"use client"

import { MapPin } from "lucide-react"
import { locations } from "@/lib/types"
import { cn } from "@/lib/utils"

interface LocationStepProps {
  selectedLocation: string
  onSelect: (locationId: string) => void
}

export function LocationStep({ selectedLocation, onSelect }: LocationStepProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-foreground mb-2">
        Selecciona una sucursal
      </h2>
      <p className="text-muted-foreground mb-6">
        Elige la sucursal mas cercana a ti
      </p>

      <div className="grid gap-4">
        {locations.map((location) => (
          <button
            key={location.id}
            type="button"
            onClick={() => onSelect(location.id)}
            className={cn(
              "w-full p-4 rounded-lg border text-left transition-all",
              "hover:border-primary hover:bg-primary/5",
              selectedLocation === location.id
                ? "border-primary bg-primary/5"
                : "border-border"
            )}
          >
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{location.city}</h3>
                <p className="text-muted-foreground text-sm">{location.address}</p>
                <p className="text-muted-foreground text-sm">Tel: {location.phone}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
