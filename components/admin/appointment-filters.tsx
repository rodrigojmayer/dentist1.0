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

interface Filters {
  status: string
  date: string
}

interface AppointmentFiltersProps {
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function AppointmentFilters({ filters, onFiltersChange }: AppointmentFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-6">
      <div className="flex-1 max-w-xs">
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
      </div>

      <div className="flex-1 max-w-xs">
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
      </div>
    </div>
  )
}
