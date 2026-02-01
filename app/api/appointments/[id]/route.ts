import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: appointment, error } = await supabase
    .from("appointments")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error || !appointment) {
    return NextResponse.json(
      { error: "Turno no encontrado" },
      { status: 404 }
    )
  }

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
  
  return NextResponse.json({ appointment: transformedAppointment })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient()
    const { id } = await params
    const body = await request.json()
    const { status } = body
    
    if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
      return NextResponse.json(
        { error: "Estado invalido" },
        { status: 400 }
      )
    }
    
    const { data: appointment, error } = await supabase
      .from("appointments")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    
    if (error || !appointment) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      )
    }

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
    
    return NextResponse.json({ appointment: transformedAppointment })
  } catch (error) {
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { error } = await supabase
    .from("appointments")
    .delete()
    .eq("id", id)
  
  if (error) {
    return NextResponse.json(
      { error: "Turno no encontrado" },
      { status: 404 }
    )
  }
  
  return NextResponse.json({ success: true })
}
