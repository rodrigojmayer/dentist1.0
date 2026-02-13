import { professionals } from "@/lib/types"
import { notFound } from "next/navigation"
import { ProfessionalCalendar } from "@/components/admin/professional-calendar"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export function generateStaticParams() {
  return professionals.map((professional) => ({
    profesional: professional.id,
  }))
}

export default async function ProfessionalPage({
  params,
}: {
  params: Promise<{ profesional: string }>
}) {
  const { profesional } = await params
  
  const professional = professionals.find((p) => p.id === profesional)
  
  if (!professional) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="bg-primary text-primary-foreground py-6">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-4">
            <Link href="/admin">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary-foreground/10  cursor-pointer">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-2xl font-serif font-semibold">{professional.name}</h1>
              <p className="text-primary-foreground/80 text-sm">
                {professional.specialties.slice(0, 3).join(" | ")}
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8">
        <ProfessionalCalendar professional={professional} />
      </div>
    </main>
  )
}
