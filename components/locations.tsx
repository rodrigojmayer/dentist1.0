import { MapPin, Phone } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const locations = [
  // {
  //   city: "Funes",
  //   address: "Catamarca 3152",
  //   phone: "3412242661",
  // },
  // {
  //   city: "Rosario",
  //   address: "9 de Julio 7109",
  //   phone: "3412701897",
  // },
  {
    city: "San Lorenzo",
    address: "Sgto. Cabral 1465",
    phone: "03476316589",
  },
]

export function Locations() {
  return (
    <section id="contacto" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contacto
          </h2>
          {/* <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Siempre cerca tuyo, con la misma calidad de atencion
          </p> */}
        </div>

        <div className="grid md:grid-cols-1 gap-8">
          {locations.map((location) => (
            <Card key={location.city} className="border-border hover:shadow-lg transition-shadow overflow-hidden  w-1/2 mx-auto">
              {/* <div className="h-48 bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                  <MapPin className="h-16 w-16 text-primary/30" />
                </div>
              </div> */}
              <div className="rounded-2xl overflow-hidden h-[450px] shadow-2xl border-4 border-white">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3355.6969243121644!2d-60.730823099999995!3d-32.7472375!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95b65afb0559aa37%3A0xf7509efadf6bbff!2sSgto.%20Cabral%201465%2C%20S2200%20San%20Lorenzo%2C%20Santa%20Fe!5e0!3m2!1ses-419!2sar!4v1777869069885!5m2!1ses-419!2sar" 
          width="100%" 
          height="100%" 
          style={{ border: 0 }} 
          allowFullScreen={true} 
          loading="lazy"
        ></iframe>
      </div>
              <CardContent className="p-6 flex flex-col items-center justify-center">
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
