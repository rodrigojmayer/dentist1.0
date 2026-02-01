import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { BookingForm } from "@/components/booking/booking-form"

export const metadata = {
  title: "Reservar Turno | Consultorios del Sol",
  description: "Reserva tu turno online en Consultorios del Sol. Atencion odontologica en Rosario, Funes y San Lorenzo."
}

export default function ReservarPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 pt-20 md:pt-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Reservar turno
            </h1>
            <p className="text-muted-foreground text-lg">
              Completa el formulario para agendar tu consulta
            </p>
          </div>
          
          <BookingForm />
        </div>
      </div>
      <Footer />
    </main>
  )
}
