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
    .select("*")
    .neq("status", "deleted") // <--- ESTA LÍNEA filtra los borrados
    .order("date", { ascending: true })
    .order("time", { ascending: true })

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
  const { data: appointments, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Transform snake_case to camelCase for frontend compatibility
  const transformedAppointments = appointments?.map(a => ({
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
