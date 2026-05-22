import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { id } = await params
  
  const { data: professional, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", id)
    .single()
  
  if (error || !professional) {
    return NextResponse.json(
      { error: "Turno no encontrado" },
      { status: 404 }
    )
  }

  const transformedProfessional = {
    id: professional.id,
    professionalName: professional.name,
    professionalSpecialities: professional.specialities,
    professionalAvailableLocations: professional.availableLocations,
  }
  
  return NextResponse.json({ professional: transformedProfessional })
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
    console.log("PATCH status: ", status)
    if (!status || !["pending", "confirmed", "cancelled", "deleted"].includes(status)) {
      return NextResponse.json(
        { error: "Estado invalido" },
        { status: 400 }
      )
    }
    
    const { data: professional, error } = await supabase
      .from("professionals")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    
    if (error || !professional) {
      return NextResponse.json(
        { error: "Turno no encontrado" },
        { status: 404 }
      )
    }

    const transformedProfessional = {
      id: professional.id,
      professionalName: professional.name,
      professionalSpecialities: professional.specialities,
      professionalAvailableLocations: professional.availableLocations,
    }
    
    return NextResponse.json({ professional: transformedProfessional })
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
    .from("professionals")
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
