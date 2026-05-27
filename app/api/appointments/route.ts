import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { generateTimeSlots } from "@/lib/types"

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const searchParams = request.nextUrl.searchParams
  const date = searchParams.get("date")
  const professionalId = searchParams.get("professionalId")
  const locationId = searchParams.get("locationId")
  const getSlots = searchParams.get("slots") === "true"
  const startDate = searchParams.get("startDate")
  const endDate = searchParams.get("endDate")

  // 1. CAPTURAMOS EL NUEVO PARÁMETRO DE MES
  const month = searchParams.get("month") // Espera un formato "YYYY-MM" (Ej: "2026-05")

  // ==========================================
  // NUEVA LÓGICA: FILTRO MENSUAL DE DÍAS LLENOS
  // ==========================================
  if (month && professionalId && locationId) {
    // Buscamos TODOS los turnos activos de ese mes para ese profesional y locación
    const { data: monthAppointments, error: monthError } = await supabase
      .from("appointments")
      .select("date, time")
      .like("date", `${month}-%`) // Filtra que la fecha empiece con "YYYY-MM-"
      .eq("professional_id", professionalId)
      .not("status", "in", '("cancelled", "deleted")')

    if (monthError) {
      return NextResponse.json({ error: monthError.message }, { status: 500 })
    }

    // Agrupamos los turnos reservados por día
    // Estructura resultante: { "2026-05-20": ["09:00", "10:30"], "2026-05-21": [...] }
    const bookingsByDay: Record<string, string[]> = {}
    monthAppointments?.forEach(app => {
      if (!bookingsByDay[app.date]) {
        bookingsByDay[app.date] = []
      }
      bookingsByDay[app.date].push(app.time)
    })

    const fullyBookedDates: string[] = []

    // Evaluamos cada día que tiene reservas para ver si se completó
    Object.keys(bookingsByDay).forEach(currentDate => {
      const bookedTimes = bookingsByDay[currentDate]
      
      // Generamos la plantilla total de turnos teóricos para ese día concreto
      // (Usa la misma función que ya tienes importada para saber cuántos turnos existen en total)
      const allSlots = generateTimeSlots(currentDate, [])
      
      
      // Filtramos los turnos teóricos quitando los que de por sí están bloqueados globalmente (como los de las "12:0")
      const totalAvailableSlotsCount = allSlots.filter(slot => !slot.time.startsWith("12:0")).length

      // Si la cantidad de turnos ya reservados es igual o mayor a los turnos reales que ofrece el día...
      if (bookedTimes.length >= totalAvailableSlotsCount) {
        fullyBookedDates.push(currentDate) // ¡Día agotado!
      }
    })

    // Devolvemos la lista al frontend para que la reciba el useEffect que armamos antes
    return NextResponse.json({ fullyBookedDates })
  }

  if (getSlots && date && professionalId && locationId) {
    // Get booked times for the specific date, professional, and location
    const { data: bookedAppointments } = await supabase
      .from("appointments")
      .select("time")
      .eq("date", date)
      .eq("professional_id", professionalId)
      .eq("location_id", locationId)
      // .neq("status", "cancelled")
      .not("status", "in", '("cancelled", "deleted")')

    const bookedTimes = bookedAppointments?.map(a => a.time) || []
    const slots = generateTimeSlots(date, bookedTimes)
    return NextResponse.json({ slots })
  }

  // Build query with optional filters
  let query = supabase
    .from("appointments")
    .select("*", { count: "exact", head: false })
    .neq("status", "deleted") // <--- ESTA LÍNEA filtra los borrados
    // .order("date", { ascending: true })
    // .order("time", { ascending: true })
    // .range(0, 4999) // 🔥 Con esto le ordenás a la API que rompa el techo de los 1000

  // Filter by professional if provided
  if (professionalId) {
    query = query.eq("professional_id", professionalId)
  }

  // Filter by date range if provided
  if (startDate) {
    query = query.gte("date", startDate)
  }
  if (endDate) {
    query = query.lte("date", endDate)
  }

  // Get appointments
  // const { data: appointments, error } = await query

  // const { data: appointments, error } = await query
  //   .order("date", { ascending: true })
  //   .order("time", { ascending: true })
  //   .range(0, 4999) // <--- Colocado acá fuerza el límite real a 5000 antes del await

  query = query.order("date", { ascending: true }).order("time", { ascending: true })
  let allAppointments: any[] = []
  let from = 0
  let to = 999
  let hasMore = true

  while (hasMore) {
    // Pedimos de a 1000 registros por vuelta
    const { data, error: chunkError } = await query.range(from, to)

    if (chunkError) {
      return NextResponse.json({ error: chunkError.message }, { status: 500 })
    }

    if (data && data.length > 0) {
      allAppointments = [...allAppointments, ...data]
      
      // Si nos devolvió menos de 1000, significa que ya vaciamos la tabla
      if (data.length < 1000) {
        hasMore = false
      } else {
        // Si devolvió 1000 exactos, preparamos el siguiente bloque
        from += 1000
        to += 1000
      }
    } else {
      hasMore = false
    }
  }

  // Transform snake_case to camelCase for frontend compatibility
  const transformedAppointments = allAppointments?.map(a => ({
    id: a.id,
    patientName: a.patient_name,
    patientEmail: a.patient_email,
    patientPhone: a.patient_phone,
    professionalId: a.professional_id,
    locationId: a.location_id,
    // serviceId: a.service_id,
    date: a.date,
    time: a.time,
    notes: a.notes,
    status: a.status,
    createdAt: a.created_at
  })) || []

  return NextResponse.json({ appointments: transformedAppointments })
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    
    const { patientName, patientEmail, patientPhone, professionalId, locationId, serviceId, date, time, notes } = body
    
    if (!patientName || !patientEmail || !patientPhone || !professionalId || !locationId || !date || !time) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios deben completarse" },
        { status: 400 }
      )
    }

    // 🔥 2. CONTROL DE FECHA Y HORA PASADA (Candado de Backend)
    const now = new Date()
    now.setHours(now.getHours())
    now.setMinutes(now.getMinutes() + 30)
    
    // Creamos el objeto Date uniendo la fecha y hora recibida (ej: "2026-05-21T09:00:00")
    // Usamos el formato local o agregamos la nomenclatura de la fecha
    const appointmentDateTime = new Date(`${date}T${time}:00`)

    console.log("now: ", now)
    console.log("appointmentDateTime: ", appointmentDateTime)
    console.log("appointmentDateTime <= now: ", appointmentDateTime <= now)

    // Si la conversión falla por algún motivo o da una fecha inválida
    if (isNaN(appointmentDateTime.getTime())) {
      return NextResponse.json(
        { error: "El formato de fecha u hora es inválido" },
        { status: 400 }
      )
    }

    // Comparamos los milisegundos estrictos
    if (appointmentDateTime <= now) {
      return NextResponse.json(
        { error: "No podés reservar un turno en una fecha u hora que ya pasó" },
        { status: 400 }
      )
    }

    // Check if slot is still available
    const { data: existing } = await supabase
      .from("appointments")
      .select("id")
      .eq("date", date)
      .eq("time", time)
      .eq("professional_id", professionalId)
      .eq("location_id", locationId)
      .neq("status", "cancelled")
      .single()

    if (existing) {
      return NextResponse.json(
        { error: "Este horario ya no esta disponible" },
        { status: 409 }
      )
    }

    const { data: appointment, error } = await supabase
      .from("appointments")
      .insert({
        patient_name: patientName,
        patient_email: patientEmail,
        patient_phone: patientPhone,
        professional_id: professionalId,
        location_id: locationId,
        // service_id: serviceId || null,
        date,
        time,
        notes: notes || null,
        status: "pending"
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Transform to camelCase
    const transformedAppointment = {
      id: appointment.id,
      patientName: appointment.patient_name,
      patientEmail: appointment.patient_email,
      patientPhone: appointment.patient_phone,
      professionalId: appointment.professional_id,
      locationId: appointment.location_id,
      // serviceId: appointment.service_id,
      date: appointment.date,
      time: appointment.time,
      notes: appointment.notes,
      status: appointment.status,
      createdAt: appointment.created_at
    }

    return NextResponse.json({ appointment: transformedAppointment }, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}
