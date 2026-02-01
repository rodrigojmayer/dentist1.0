import { MapPin, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const locations = [
  {
    city: "Funes",
    address: "Catamarca 1762",
    phone: "3412427286",
  },
  {
    city: "Rosario",
    address: "9 de Julio 1209",
    phone: "3412722087",
  },
  {
    city: "San Lorenzo",
    address: "Bv. Urquiza",
    phone: "3476210367",
  },
]

export function Locations() {
  return (
    <section id="sucursales" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Todas nuestras sucursales
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Siempre cerca tuyo, con la misma calidad de atencion
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {locations.map((location) => (
            <Card key={location.city} className="border-border hover:shadow-lg transition-shadow overflow-hidden">
              <div className="h-48 bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <MapPin className="h-16 w-16 text-primary/30" />
                </div>
              </div>
              <CardContent className="p-6">
                <h3 className="font-serif text-2xl font-semibold text-foreground mb-4">
                  {location.city}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0" />
                    <span>{location.address}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <a 
                      href={`tel:${location.phone}`}
                      className="hover:text-primary transition-colors"
                    >
                      Turnos: {location.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
