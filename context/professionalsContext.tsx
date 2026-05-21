"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import type { Professional } from "@/lib/types"

interface ProfessionalContextType {
    professionals: Professional[]
    loading: boolean
    refreshProfessionals: () => Promise<void>
}

const ProfessionalContext = createContext<ProfessionalContextType | undefined>(undefined)

export function ProfessionalProvider({ children }: { children: ReactNode }) {
    const [professionals, setProfessionals] = useState<Professional[]>([])
    const [loading, setLoading] = useState(true)

    const fetchProfessionals = async () => {
    setLoading(true) // Opcional si querés ver un loader la primera vez
    try {
      const response = await fetch("/api/professionals")
      if (!response.ok) return

      const data = await response.json()
      
      setProfessionals(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error cargando profesionales:", error)
      setProfessionals([]) // En caso de error, dejamos un array vacío para que no rompa el .map()
    } finally {
      setLoading(false)
    }
  }

  // Se ejecuta UNA SOLA VEZ cuando se monta el Provider
  useEffect(() => {
    fetchProfessionals()
  }, [])

  return (
    <ProfessionalContext.Provider 
      value={{ professionals, loading, refreshProfessionals: fetchProfessionals }}
    >
      {children}
    </ProfessionalContext.Provider>
  )
}

// Hook personalizado para usarlo donde quieras en 1 sola línea
export function useProfessionalContext() {
  const context = useContext(ProfessionalContext)
  if (!context) {
    throw new Error("useProfessionalContext debe usarse dentro de un ProfessionalProvider")
  }
  return context
}