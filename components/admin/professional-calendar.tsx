"use client"

import { useState, useEffect, useCallback } from "react"
import { Professional, Appointment, locations } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, User, Phone, Mail, MapPin, FileText, Stethoscope, MoreHorizontal, Trash2, X, Check, CalendarDays } from "lucide-react"
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
import { useAppointments } from "@/hooks/use-appointments"
import { AppointmentDetailDialog } from "@/components/admin/appointment-detail-dialog" // <-- Importar acá
import { useToday } from "@/hooks/use-today"
import { cn } from "@/lib/utils"

interface ProfessionalCalendarProps {
  professional: Professional
}

interface AppointmentWithService extends Appointment {
  service?: string
}

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9) // 9:00 - 18:00

export function ProfessionalCalendar({ professional }: ProfessionalCalendarProps) {
  
  const {
    appointments,
    setAppointments,
    handleStatusChange,
    handleDelete
  } = useAppointments()

  const [currentDate, setCurrentDate] = useState(new Date())
  // const [appointments, setAppointments] = useState<AppointmentWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithService | null>(null)

  // 💡 Consumimos el hook (no pasamos parámetros porque la UI del calendario evalúa "hoySelected" basándose en otra lógica)
  const { fechaHoyString } = useToday()

  // 💡 Evaluamos si la vista actual del calendario es la semana de hoy
  const hoySelected = currentDate.toDateString() === new Date().toDateString()

  const handleSetToday = () => {
    setCurrentDate(new Date()) // Restablece el calendario al día actual
  }

  const getWeekDays = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1)
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const d = new Date(startOfWeek)
      d.setDate(startOfWeek.getDate() + i)
      week.push(d)
    }
    return week
  }

  const weekDays = getWeekDays(currentDate)

  const formatDateLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    try {
      // const startDate = weekDays[0].toISOString().split("T")[0]
      // const endDate = weekDays[6].toISOString().split("T")[0]
      const startDate = formatDateLocal(weekDays[0]);
      const endDate = formatDateLocal(weekDays[6]);
      const response = await fetch(
        `/api/appointments?professionalId=${professional.id}&startDate=${startDate}&endDate=${endDate}`
      )
      if (response.ok) {
        const data = await response.json()
        // setAppointments(data)
        // // CAMBIO AQUÍ: Accedé a la propiedad appointments del objeto
        console.log("fetchAppointments data: ", data)
        setAppointments(data.appointments || [])
      }
    } catch (error) {
      console.error("Error fetching appointments:", error)
      setAppointments([]) // Default a array vacío si falla
    } finally {
      setLoading(false)
    }
  }, [professional.id, weekDays[0].toISOString(), weekDays[6].toISOString()])

  useEffect(() => {
    fetchAppointments()
  }, [fetchAppointments])

  const previousWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() - 7)
    setCurrentDate(newDate)
  }

  const nextWeek = () => {
    const newDate = new Date(currentDate)
    newDate.setDate(newDate.getDate() + 7)
    setCurrentDate(newDate)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const getAppointmentForSlot = (date: Date, hour: number) => {
    // En lugar de toISOString(), armamos el string local "YYYY-MM-DD"
    // const dateStr = date.toISOString().split("T")[0]
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateStr = `${year}-${month}-${day}`;

    return appointments.filter((apt) => {
      const aptHour = Number.parseInt(apt.time.split(":")[0])
      return apt.date === dateStr && aptHour === hour && apt.status !== "cancelled"
    })
  }

  const formatMonthYear = () => {
    const options: Intl.DateTimeFormatOptions = { month: "long", year: "numeric" }
    return currentDate.toLocaleDateString("es-AR", options)
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const getLocationName = (locationId: string) => {
    return locations.find((l) => l.id === locationId)?.city || locationId
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-500"
      case "pending":
        return "bg-amber-500"
      case "cancelled":
        return "bg-red-500"
      default:
        return "bg-muted"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Confirmado"
      case "pending":
        return "Pendiente"
      case "cancelled":
        return "Cancelado"
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">              
          <div className="w-full sm:w-auto flex flex-col justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={previousWeek}
              className={cn(
                "w-full sm:w-auto h-10 gap-2 cursor-pointer text-sm font-medium transition-all duration-200 mb-0",
                "border-border/80 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground"
              )}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          </div>
          <div className="w-full sm:w-auto flex flex-col justify-end">
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
              Semana actual
            </Button>
          </div>
          <div className="w-full sm:w-auto flex flex-col justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={nextWeek}
              className={cn(
              "w-full sm:w-auto h-10 gap-2 cursor-pointer text-sm font-medium transition-all duration-200 mb-0",
              "border-border/80 hover:border-primary hover:bg-primary/5 text-muted-foreground hover:text-foreground"
            )}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <h2 className="text-xl font-semibold capitalize">{formatMonthYear()}</h2>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500" />
            <span>Confirmado</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span>Pendiente</span>
          </div>
        </div>
      </div>

      <Card  className="p-0">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px] table-fixed">
                <colgroup>
                  <col className="w-20" /> 
                  {weekDays.map((day, idx) => {
                    const isWeekend = day.getDay() === 0 || day.getDay() === 6;
                    return <col key={`col-${idx}`} className={isWeekend ? "w-[60px]" : "w-1/5"} />;
                  })}
                </colgroup>
                <thead className="text-sm font-medium">
                  <tr>
                    <th className="border-b border-r bg-muted/50 " />
                    {(() => {
                      const monthStyles: Record<string, { header: string; day: string }> = {
                        enero: { header: "bg-blue-500/15 text-blue-800", day: "bg-blue-500/5" },
                        febrero: { header: "bg-pink-500/15 text-pink-800", day: "bg-pink-500/5" },
                        marzo: { header: "bg-emerald-500/15 text-emerald-800", day: "bg-emerald-500/5" },
                        abril: { header: "bg-purple-500/20 text-purple-900", day: "bg-purple-500/10" },
                        mayo: { header: "bg-sky-500/15 text-sky-800", day: "bg-sky-500/5" },
                        junio: { header: "bg-amber-500/20 text-amber-900", day: "bg-amber-500/10" },
                        julio: { header: "bg-teal-500/15 text-teal-800", day: "bg-teal-500/5" },
                        agosto: { header: "bg-indigo-500/15 text-indigo-800", day: "bg-indigo-500/5" },
                        septiembre: { header: "bg-lime-500/15 text-lime-800", day: "bg-lime-500/5" },
                        octubre: { header: "bg-orange-500/15 text-orange-800", day: "bg-orange-500/5" },
                        noviembre: { header: "bg-cyan-500/15 text-cyan-800", day: "bg-cyan-500/5" },
                        diciembre: { header: "bg-rose-500/15 text-rose-800", day: "bg-rose-500/5" },
                      };
                      
                      const getStylesForDate = (date: Date) => {
                        const mName = date.toLocaleDateString("es-AR", { month: "long" }).toLowerCase();
                        return monthStyles[mName] || { header: "bg-muted text-muted-foreground", day: "bg-muted/30" };
                      };

                      (globalThis as any)._getStyles = getStylesForDate;
                      
                      const monthGroups: { month: string; count: number }[] = [];
                      
                      weekDays.forEach((day) => {
                        const monthName = day.toLocaleDateString("es-AR", { month: "long" });
                        const lastGroup = monthGroups[monthGroups.length - 1];
                        
                        if (lastGroup && lastGroup.month === monthName) {
                          lastGroup.count++;
                        } else {
                          monthGroups.push({ month: monthName, count: 1 });
                        }
                      });

                      return (
                        <>
                          {monthGroups.map((group, index) => {
                            const mName = group.month.toLowerCase();
                            const styles = monthStyles[mName] || { header: "bg-muted text-muted-foreground", day: "" };
                            return (
                              <th
                                key={`month-${index}`}
                                colSpan={group.count}
                                className={cn(
                                  "p-2 border-b border-r text-center font-bold capitalize text-xs tracking-wider transition-colors",
                                  styles.header
                                )}
                              >
                                {group.month}
                              </th>
                            );
                          })}
                        </>
                      );
                    })()}
                  </tr>
                  <tr>
                    <th className="p-2 border-b border-r bg-muted/50 text-muted-foreground text-sm font-medium">
                      Hora
                    </th>
                    {weekDays.map((day, index) => {
                      
                      const dateStyles = (globalThis as any)._getStyles ? (globalThis as any)._getStyles(day) : { day: "bg-muted/30" };
                      
                      return (
                        <th
                          key={index}
                          className={cn(
                            "p-2 border-b text-center border-r last:border-r-0 transition-colors",
                            isToday(day) ? "bg-primary/70 ring-2 ring-primary/20" : dateStyles.day
                          )}
                        >
                          <div className={cn(
                            "text-xs uppercase font-medium",
                            isToday(day) ? "text-muted font-bold " : "text-muted-foreground/90"
                          )}>
                            {day.toLocaleDateString("es-AR", { weekday: "short" })}
                          </div>
                          <div
                            className={cn(
                              "text-lg font-bold",
                              isToday(day) ? "text-muted" : "text-foreground/90"
                            )}
                          >
                            {day.getDate()}
                          </div>
                        </th>
                      )
                    })}
                  </tr>
                </thead>
                <tbody>
                  {HOURS.map((hour) => (
                    <tr key={hour}>
                      <td className="p-2 border-b border-r bg-muted/30 text-sm text-muted-foreground text-center">
                        {hour}:00
                      </td>
                      {weekDays.map((day, dayIndex) => {
                        const dayAppointments = getAppointmentForSlot(day, hour)
                        const isSunday = day.getDay() === 0
                        const isSaturday = day.getDay() === 6
                        
                        return (
                          <td
                            key={dayIndex}
                            className={`p-1 border-b border-r h-12 align-top ${
                              isToday(day) ? "bg-primary/5" : ""
                            } ${isSunday || isSaturday ? "bg-muted/40" : ""}`}
                          >
                            {dayAppointments.map((apt) => (
                              <button
                                type="button"
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt)} 
                                className={`w-full mb-1 p-1 rounded text-[12px] text-left text-xs text-card transition-transform hover:scale-[1.02] cursor-pointer ${getStatusColor(
                                  apt.status
                                )}`}
                              >
                                <div className="font-semibold truncate">
                                  {apt.time} - {apt.patientName}
                                </div>
                              </button>
                            ))}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AppointmentDetailDialog
        appointment={selectedAppointment}
        isOpen={!!selectedAppointment}
        onClose={() => setSelectedAppointment(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDelete}
        onUpdateLocalState={(updatedApt) => setSelectedAppointment(updatedApt)}
      />
    </div>
  )
}
