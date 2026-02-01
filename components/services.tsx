const services = [
  "CORONAS",
  "ORTOPEDIA",
  "IMPLANTES",
  "ORTODONCIAS",
  "BOTOX para bruxismo",
  "ODONTOPEDIATRIA",
  "BOTOX para lineas de expresion",
  "BLANQUEAMIENTOS",
  "ESTETICA DENTAL",
  "LIMPIEZA DENTAL",
  "TRAT. DE BRUXISMO",
  "PROTESIS REMOVIBLES",
  "TRAT. DE CONDUCTOS",
  "ALINEADORES INVISIBLES",
  "CIRUGIAS BUCALES",
  "RELLENO DE LABIOS",
  "RINOMODELACION",
]

export function Services() {
  return (
    <section id="servicios" className="py-20 md:py-28 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Conoce todos nuestros servicios
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Ofrecemos una amplia gama de tratamientos para cuidar tu sonrisa
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {services.map((service) => (
            <div 
              key={service}
              className="bg-primary-foreground/10 backdrop-blur-sm border border-primary-foreground/20 rounded-lg p-4 text-center hover:bg-primary-foreground/20 transition-colors"
            >
              <span className="text-primary-foreground font-medium text-sm md:text-base">
                {service}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
