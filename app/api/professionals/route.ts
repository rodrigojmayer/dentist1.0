import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = await createClient()

    // Traemos todos los profesionales ordenados alfabéticamente por nombre
    const { data: professionals, error } = await supabase
      .from("professionals")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error de Supabase al traer profesionales:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Devolvemos el array plano de profesionales directamente
    return NextResponse.json(professionals, { status: 200 })

  } catch (error) {
    console.error("Error interno en API professionals:", error)
    return NextResponse.json(
      { error: "Error al procesar la solicitud" },
      { status: 500 }
    )
  }
}