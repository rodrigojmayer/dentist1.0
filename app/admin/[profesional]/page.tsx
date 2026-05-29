import { notFound } from "next/navigation"
import { ProfessionalCalendar } from "@/components/admin/professional-calendar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/server"
import type { Professional } from "@/lib/types"
import { Header } from "@/components/header"

// 💡 ESTA LÍNEA ES LA CLAVE: Le avisa a Next.js que no intente pre-renderizar esto de forma estática
export const dynamic = "force-dynamic"

export default async function ProfessionalPage({
  params,
}: {
  params: Promise<{ profesional: string }>
}) {
  const { profesional } = await params
  const supabase = await createClient()

  const { data: professional, error } = await supabase
    .from("professionals")
    .select("*")
    .eq("id", profesional)
    .single()

  if (error || !professional) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background pt-20 md:pt-24">
      <Header isAdmin={true} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Agenda semanal: &nbsp;&nbsp;
            <span className="font-serif font-semibold  capitalize">
              {professional.name}
            </span>
          </h1>
          <p className="text-muted-foreground text-sm">
            {professional.specialties ? professional.specialties.slice(0, 3).join(" | ") : "General"}

          </p>
        </div>

        {/* Bloque Derecho: Calendario Semanal por Profesional */}
        
        
      </div>
      
        
        <div className="container mx-auto p-0">
          <ProfessionalCalendar professional={professional as Professional} />
        </div>
      </main>
    </div>
  )
}