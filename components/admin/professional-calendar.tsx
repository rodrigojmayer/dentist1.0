"use client"

import { useState, useEffect, useCallback } from "react"
import { Professional, Appointment, locations } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, Clock, User, Phone, Mail, MapPin, FileText, Stethoscope } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface ProfessionalCalendarProps {
  professional: Professional
}

interface AppointmentWithService extends Appointment {
  service?: string
}

const HOURS = Array.from({ length: 10 }, (_, i) => i + 9) // 9:00 - 18:00

export function ProfessionalCalendar({ professional }: ProfessionalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [appointments, setAppointments] = useState<AppointmentWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedAppointment, setSelectedAppointment] = useState<AppointmentWithService | null>(null)

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
      {/* Header con navegacion */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={previousWeek}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextWeek}>
                <ChevronRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" onClick={goToToday}>
                Hoy
              </Button>
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
        </CardContent>
      </Card>

      {/* Calendario semanal */}
      <Card>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[800px]">
                <thead>
                  <tr>
                    <th className="w-20 p-2 border-b border-r bg-muted/50 text-muted-foreground text-sm font-medium">
                      Hora
                    </th>
                    {weekDays.map((day, index) => (
                      <th
                        key={index}
                        className={`p-2 border-b text-center ${
                          isToday(day) ? "bg-primary/10" : "bg-muted/30"
                        }`}
                      >
                        <div className="text-xs text-muted-foreground uppercase">
                          {day.toLocaleDateString("es-AR", { weekday: "short" })}
                        </div>
                        <div
                          className={`text-lg font-semibold ${
                            isToday(day) ? "text-primary" : ""
                          }`}
                        >
                          {day.getDate()}
                        </div>
                      </th>
                    ))}
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
                        console.log("weekDays.map day: ", day)
                        console.log("weekDays.map dayIndex: ", dayIndex)
                        console.log("weekDays.map dayAppointments: ", dayAppointments)
                        const isSunday = day.getDay() === 0
                        
                        return (
                          <td
                            key={dayIndex}
                            className={`p-1 border-b border-r h-20 align-top ${
                              isToday(day) ? "bg-primary/5" : ""
                            } ${isSunday ? "bg-muted/40" : ""}`}
                          >
                            {dayAppointments.map((apt) => (
                              <button
                                type="button"
                                key={apt.id}
                                onClick={() => setSelectedAppointment(apt)}
                                className={`w-full mb-1 p-2 rounded text-left text-xs text-card transition-transform hover:scale-[1.02] cursor-pointer ${getStatusColor(
                                  apt.status
                                )}`}
                              >
                                <div className="font-semibold truncate">
                                  {apt.time} - {apt.patientName}
                                </div>
                                <div className="truncate opacity-90">
                                  {getLocationName(apt.locationId)}
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

      {/* Dialog con detalles del turno */}
      <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Detalle del Turno</span>
              <Badge
                className={`${getStatusColor(selectedAppointment?.status || "")} text-card border-0`}
              >
                {getStatusText(selectedAppointment?.status || "")}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              {/* Fecha y Hora */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Fecha y Hora
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="font-semibold">
                    {new Date(selectedAppointment.date + "T12:00:00").toLocaleDateString("es-AR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                  <p className="text-lg text-primary font-bold">{selectedAppointment.time} hs</p>
                </CardContent>
              </Card>

              {/* Informacion del Paciente */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Paciente
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  <p className="font-semibold text-lg">{selectedAppointment.patientName}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${selectedAppointment.patientEmail}`} className="hover:text-primary">
                      {selectedAppointment.patientEmail}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${selectedAppointment.patientPhone}`} className="hover:text-primary">
                      {selectedAppointment.patientPhone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              {/* Ubicacion y Servicio */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Servicio y Ubicacion
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0 space-y-2">
                  {selectedAppointment.service && (
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">{selectedAppointment.service}</Badge>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{getLocationName(selectedAppointment.locationId)}</span>
                  </div>
                </CardContent>
              </Card>

              {/* Notas */}
              {selectedAppointment.notes && (
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                      <FileText className="h-4 w-4" />
                      Notas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-sm">{selectedAppointment.notes}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
