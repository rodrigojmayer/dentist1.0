"use client"

import { useState } from "react"
import type { Appointment } from "@/lib/types"

export function useAppointments(initialAppointments: Appointment[] = []) {
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)

  const handleStatusChange = async (
    id: string,
    status: "confirmed" | "cancelled" | "deleted"
  ) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      })

      if (!response.ok) return

      setAppointments(prev => {
        if (status === "deleted") {
          return prev.filter(apt => apt.id !== id)
        }
        return prev.map(apt =>
          apt.id === id ? { ...apt, status } : apt
        )
      })
    } catch (error) {
      console.error("Error updating appointment:", error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Está seguro de eliminar este turno?")) return
    handleStatusChange(id, "deleted")
  }

  return {
    appointments,
    setAppointments,
    handleStatusChange,
    handleDelete,
  }
}