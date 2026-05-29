"use client"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button" 
import { CalendarDays } from "lucide-react"
import { cn } from "@/lib/utils"

// MODIFICADO: Ajustamos la interfaz para reflejar la nueva estructura de rango de fechas
interface Filters {
  status: string
  // date: string
  date: {
    from: string
    to: string
  }
}

interface AppointmentFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function AppointmentFilters({ filters, onFiltersChange }: AppointmentFiltersProps) {
  
  // 💡 1. Calculamos la fecha de hoy en formato local YYYY-MM-DD
  const hoy = new Date()
  const anio = hoy.getFullYear()
  const mes = String(hoy.getMonth() + 1).padStart(2, '0')
  const dia = String(hoy.getDate()).padStart(2, '0')
  const fechaHoyString = `${anio}-${mes}-${dia}` // Ejemplo: "2026-05-29"

  // 💡 2. Determinamos si está seleccionado evaluando el estado actual de los filtros
  const hoySelected = filters.date.from === fechaHoyString && filters.date.to === fechaHoyString

  const handleSetToday = () => {
    onFiltersChange({
      ...filters,
      date: {
        from: fechaHoyString,
        to: fechaHoyString
      }
    })
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6 ">
      {/* <div className="flex-1 max-w-xs">
        <Label htmlFor="status-filter" className="mb-2 block text-sm">
          Estado
        </Label>
        <Select
          value={filters.status}
          onValueChange={(value) => onFiltersChange({ ...filters, status: value })}
          >
          <SelectTrigger 
            id="status-filter"
            className={"cursor-pointer"}
          >
            <SelectValue placeholder="Todos los estados"/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all" className={"cursor-pointer"}>Todos</SelectItem>
            <SelectItem value="pending" className={"cursor-pointer"}>Pendientes</SelectItem>
            <SelectItem value="confirmed" className={"cursor-pointer"}>Confirmados</SelectItem>
            <SelectItem value="cancelled" className={"cursor-pointer"}>Cancelados</SelectItem>
          </SelectContent>
        </Select>
      </div> */}

      {/* <div className="flex-1 max-w-xs">
        <Label htmlFor="date-filter" className="mb-2 block text-sm">
          Fecha
        </Label>
        <Input
          id="date-filter"
          type="date"
          className={"cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer"}
          value={filters.date}
          onChange={(e) => onFiltersChange({ ...filters, date: e.target.value })}
        />
      </div> */}
      {/* MODIFICADO: Inputs de Rango de Fechas (Desde / Hasta) */}
      <div className="flex-1 max-w-xs w-full">
        <Label htmlFor="date-from-filter" className="mb-2 block text-sm">
          Fecha Desde
        </Label>
        <Input
          id="date-from-filter"
          type="date"
          className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:border-primary"
          value={filters.date.from}
          onChange={(e) => onFiltersChange({ 
            ...filters, 
            date: { ...filters.date, from: e.target.value } 
          })}
        />
      </div>
      <div className="flex-1 max-w-xs w-full">
        <Label htmlFor="date-to-filter" className="mb-2 block text-sm">
          Fecha Hasta
        </Label>
        <Input
          id="date-to-filter"
          type="date"
          className="cursor-pointer [&::-webkit-calendar-picker-indicator]:cursor-pointer hover:border-primary"
          value={filters.date.to}
          onChange={(e) => onFiltersChange({ 
            ...filters, 
            date: { ...filters.date, to: e.target.value } 
          })}
        />
      </div>
      <div className="w-full sm:w-auto flex flex-col justify-end"
      >
        <Button
          type="button"
          variant="outline"
          onClick={handleSetToday}
          className={cn(
          "w-full sm:w-auto h-10 gap-2 cursor-pointer text-sm font-medium transition-all duration-200 mb-0",
          hoySelected
            ? "border-primary bg-primary/5 ring-1 hover:bg-primary/5 ring-primary/20 text-primary hover:text-primary shadow-md scale-[1.02]" 
            : "border-border/80 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground"
        )}
        >
          <CalendarDays className={cn(
              "h-4 w-4 transition-colors",
              hoySelected ? "text-primary" : "text-muted-foreground"
            )} 
         />
          Hoy
        </Button>
      </div>
    </div>
  )
}
