import { CheckCircle } from "lucide-react"

export function About() {
  return (
    <section id="nosotros" className="py-20 md:py-28 bg-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-6">
              Sobre nosotros
            </h2>
            <h3 className="text-xl font-medium text-primary mb-4">
              Odontologos totalmente profesionales
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              En Instituto Odontológico Especializado creemos que una sonrisa saludable transforma la vida de las personas. Nuestro equipo de profesionales combina experiencia, pasion y calidez humana para brindarte la mejor atencion en cada visita.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Trabajamos de manera integral, cada especialista aportando su conocimiento para lograr resultados duraderos y una experiencia comoda y confiable. Tu salud y tu confianza son nuestra prioridad.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">+5 anos de experiencia</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Todas nuestras sucursales estan clinicamente equipadas</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                <span className="text-foreground">Buena calidad de atencion y servicio</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square bg-muted rounded-2xl overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center bg-primary/5">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-6xl">😊</span>
                  </div>
                  <p className="text-lg font-medium text-primary">Tu sonrisa, nuestra prioridad</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
