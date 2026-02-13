import { Shield, Clock, Heart, Award } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

const features = [
  {
    icon: Shield,
    title: "Obras sociales y particulares",
    description: "Trabajamos con las principales obras sociales y tambien atencion particular.",
  },
  {
    icon: Clock,
    title: "+5 anos de experiencia",
    description: "Anos de trayectoria cuidando la salud bucal de nuestros pacientes.",
  },
  {
    icon: Heart,
    title: "Atencion personalizada",
    description: "Cada paciente es unico. Adaptamos los tratamientos a tus necesidades.",
  },
  {
    icon: Award,
    title: "Equipamiento de calidad",
    description: "Todas nuestras sucursales estan clinicamente equipadas con tecnologia moderna.",
  },
]

export function WhyUs() {
  return (
    <section className="py-20 md:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-primary font-medium mb-2 block">Por que elegirnos</span>
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4 text-balance">
            Hacemos tus visitas al dentista lo mas comodas posibles
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <Link href="/reservar">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer">
              Reservar turno ahora
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
