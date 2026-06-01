import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShieldAlert } from "lucide-react"

export default function UnauthorizedPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
      <ShieldAlert className="h-16 w-16 text-destructive mb-4" />
      <h1 className="text-2xl font-bold tracking-tight mb-2">Acceso Denegado</h1>
      <p className="text-muted-foreground max-w-sm mb-6">
        Tu correo electrónico de Google no está registrado en la lista de administradores autorizados de la clínica.
      </p>
      <Button asChild>
        <Link href="/">Volver al Inicio</Link>
      </Button>
    </div>
  )
}