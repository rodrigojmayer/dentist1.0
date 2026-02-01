import { Sun, Phone, MapPin, Instagram, Facebook } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Sun className="h-8 w-8 text-accent" />
              <span className="font-serif text-2xl font-semibold">Consultorios del Sol</span>
            </Link>
            <p className="text-background/70 mb-6 max-w-md">
              Cuidando sonrisas en Rosario, Funes y San Lorenzo. Misma calidad, mismos profesionales, siempre cerca tuyo.
            </p>
            <div className="flex gap-4">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contacto</h3>
            <div className="space-y-3 text-background/70">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>3412722087</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>9 de Julio 1209, Rosario</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>
            <div className="space-y-3">
              <Link href="#equipo" className="block text-background/70 hover:text-background transition-colors">
                Equipo
              </Link>
              <Link href="#nosotros" className="block text-background/70 hover:text-background transition-colors">
                Nosotros
              </Link>
              <Link href="#sucursales" className="block text-background/70 hover:text-background transition-colors">
                Sucursales
              </Link>
              <Link href="/reservar" className="block text-background/70 hover:text-background transition-colors">
                Sacar turno
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Consultorios del Sol. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
