import Link from "next/link"

export function HeaderPublicNavigation() {
  return (
    <nav className="hidden md:flex items-center gap-8">
      <Link href="/#equipo" className="text-muted-foreground hover:text-primary transition-colors">
        Equipo
      </Link>
      <Link href="/#nosotros" className="text-muted-foreground hover:text-primary transition-colors">
        Nosotros
      </Link>
      <Link href="/#contacto" className="text-muted-foreground hover:text-primary transition-colors">
        Contacto
      </Link>
      <Link href="/#servicios" className="text-muted-foreground hover:text-primary transition-colors">
        Servicios
      </Link>
    </nav>
  )
}