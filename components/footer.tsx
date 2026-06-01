"use client"
import Image from "next/image"
import { Sun, Phone, MapPin, Instagram, Facebook } from "lucide-react"
import Link from "next/link"
import { LoginAdminButton } from "./loginButton"

const NAV_LINKS = [
  // { href: "/#equipo", label: "Equipo" },
  // { href: "/#nosotros", label: "Nosotros" },
  // { href: "/#contacto", label: "Contacto" },
  // { href: "/reservar", label: "Sacar turno" },
  { href: "/admin", label: "Admin" },
]

export function Footer() {

  const linkClassName = "block text-background/70 hover:text-background transition-colors"

  return (
    <footer className="bg-foreground text-background py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              {/* <Sun className="h-8 w-8 text-accent" /> */}
              <img src="/Gemini_Generated_Image_qswhjbqswhjbqswh-removebg-preview8.png" className="h-15 w-auto object-contain block pb-2"/>
              <span className="font-serif text-2xl font-semibold">Instituto Odontológico Austral</span>
            </Link>
            {/* <p className="text-background/70 mb-6 max-w-md">
              Cuidando sonrisas en Rosario, Funes y San Lorenzo. Misma calidad, mismos profesionales, siempre cerca tuyo.
              Cuidando sonrisas en San Lorenzo. Misma calidad, mismos profesionales, siempre cerca tuyo.
            </p> */}
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
                {/* <span>3412701897</span> */}
                <span>03476316589</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                {/* <span>9 de Julio 7109, Rosario</span> */}
                <span>Sgto. Cabral 1465, San Lorenzo</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Enlaces</h3>

            {/* <div className="space-y-3">
              {NAV_LINKS.map((link) => (
                <Link 
                  key={link.href} 
                  href={link.href} 
                  className={linkClassName}
                >
                  {link.label}
                </Link>
              ))}
            </div> */}
            <LoginAdminButton/>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-8 text-center text-background/50 text-sm">
          <p>&copy; {new Date().getFullYear()} Instituto Odontológico Austral. Todos los derechos reservados.</p>
          
        </div>
      </div>
    </footer>
  )
}
