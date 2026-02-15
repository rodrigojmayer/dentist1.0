"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { TimeSlot } from "@/lib/types"

interface DateTimeStepProps {
  professionalId: string
  locationId: string
  selectedDate: string
  selectedTime: string
  onSelect: (date: string, time: string) => void
  onBack: () => void
}

const DAYS = ["Dom", "Lun", "Mar", "Mie", "Jue", "Vie", "Sab"]
const MONTHS = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"]

export function DateTimeStep({ professionalId, locationId, selectedDate, selectedTime, onSelect, onBack }: DateTimeStepProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [date, setDate] = useState(selectedDate)
  const [time, setTime] = useState(selectedTime)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (date) {
      setLoading(true)
      fetch(`/api/appointments?slots=true&date=${date}&professionalId=${professionalId}&locationId=${locationId}`)
        .then(res => res.json())
        .then(data => {
          const fetchedSlots: TimeSlot[] = data.slots || []
          // --- Lógica para filtrar horarios pasados ---
          const now = new Date()
          const todayStr = now.toISOString().split("T")[0]
          const processedSlots = fetchedSlots.map(slot => {
            // Si la fecha elegida es hoy, comparamos las horas
            if (date === todayStr) {
              const [slotHour, slotMinutes] = slot.time.split(":").map(Number)
              const currentTime = now.getHours() * 60 + now.getMinutes()
              const slotTime = slotHour * 60 + (slotMinutes || 0)

              if (slotTime <= currentTime + 30) { // Hasta media hora hacia adelante se inhabilitan los turnos 
                return { ...slot, available: false }
              }
            }
            return slot
          })

          setSlots(processedSlots)
          setLoading(false)
        })
        .catch(() => {
          setSlots([])
          setLoading(false)
        })
    }
  }, [date, professionalId, locationId])

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const isDateDisabled = (day: number) => {
    const checkDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    // Disable past dates and weekends
    return checkDate < today || checkDate.getDay() === 0
  }

  const formatDateString = (day: number) => {
    const year = currentMonth.getFullYear()
    const month = String(currentMonth.getMonth() + 1).padStart(2, '0')
    const dayStr = String(day).padStart(2, '0')
    return `${year}-${month}-${dayStr}`
  }

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth())
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth())
    const days = []

    // Empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10" />)
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = formatDateString(day)
      const isDisabled = isDateDisabled(day)
      const isSelected = date === dateString

      days.push(
        <button
          key={day}
          type="button"
          disabled={isDisabled}
          onClick={() => {
            setDate(dateString)
            setTime("")
          }}
          className={cn(
            "h-10 w-full rounded-md text-sm transition-colors cursor-pointer",
            isDisabled && "text-muted-foreground/50 cursor-not-allowed",
            !isDisabled && "hover:bg-primary/10",
            isSelected && !isDisabled && "bg-primary text-primary-foreground hover:bg-primary"
          )}
        >
          {day}
        </button>
      )
    }

    return days
  }

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const canGoPrev = () => {
    const now = new Date()
    return currentMonth.getFullYear() > now.getFullYear() || 
      (currentMonth.getFullYear() === now.getFullYear() && currentMonth.getMonth() > now.getMonth())
  }

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-4 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Volver</span>
      </button>

      <h2 className="text-xl font-semibold text-foreground mb-2">
        Selecciona fecha y hora
      </h2>
      <p className="text-muted-foreground mb-6">
        Elige el momento que mejor te convenga
      </p>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Calendar */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              {MONTHS[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </h3>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={prevMonth}
                disabled={!canGoPrev()}
                className="p-1 rounded hover:bg-muted disabled:opacity-50 cursor-pointer"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={nextMonth}
                className="p-1 rounded hover:bg-muted cursor-pointer"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-1 mb-2">
            {DAYS.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-muted-foreground">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>
        </div>

        {/* Time slots */}
        <div>
          <h3 className="font-medium text-foreground flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-primary" />
            Horarios disponibles
          </h3>
          
          {!date ? (
            <p className="text-muted-foreground text-sm">
              Selecciona una fecha para ver los horarios disponibles
            </p>
          ) : loading ? (
            <p className="text-muted-foreground text-sm">Cargando horarios...</p>
          ) : (
            <div className="grid grid-cols-3 gap-2 max-h-[280px] overflow-y-auto">
              {slots.map((slot) => (
                <button
                  key={slot.time}
                  type="button"
                  disabled={!slot.available}
                  onClick={() => setTime(slot.time)}
                  className={cn(
                    "py-2 px-3 rounded-md text-sm border transition-colors cursor-pointer",
                    !slot.available && "bg-muted text-muted-foreground/50 cursor-not-allowed border-transparent",
                    slot.available && time !== slot.time && "border-border hover:border-primary hover:bg-primary/5",
                    time === slot.time && "bg-primary text-primary-foreground border-primary"
                  )}
                >
                  {slot.time}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={() => onSelect(date, time)}
          disabled={!date || !time}
          className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer"
        >
          Continuar
        </Button>
      </div>
    </div>
  )
}
