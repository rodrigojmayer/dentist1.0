import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-dental.jpg')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/80 to-foreground/40" />
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center md:text-left">
        <div className="max-w-2xl">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-background mb-6 text-balance">
            Instituto Odontológico Especializado
          </h1>
          <p className="text-lg md:text-xl text-background/90 mb-8 leading-relaxed">
            Cuidando sonrisas en Rosario, Funes y San Lorenzo. Misma calidad, mismos profesionales, siempre cerca tuyo.
          </p>
          <Link href="/reservar">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-medium text-lg px-8 py-6 cursor-pointer">
              Reservar turno
            </Button>
          </Link>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-background/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-background/50 rounded-full mt-2" />
        </div>
      </div>
    </section>
  )
}
