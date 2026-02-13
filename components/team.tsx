import { Card, CardContent } from "@/components/ui/card"

const team = [
  {
    name: "Od. Ana Marquez",
    specialties: "Alineadores invisibles - Ortodoncia - Botox - Odontopediatria - Odontologia general",
    image: "/team/ana.jpg"
  },
  {
    name: "Od. Mailen Luque",
    specialties: "Cirugias - Implantes - Coronas sobre implantes - Frenectomias - Gingivectomias - Extracciones",
    image: "/team/adriana.jpg"
  },
  {
    name: "Od. Erica Fani",
    specialties: "Protesis - Estetica - Tratamientos de conducto - Extracciones - Odontologia general",
    image: "/team/erica.jpg"
  },
  {
    name: "Od. Carla Perez",
    specialties: "Ortodoncia - Ortopedia - Alineadores invisibles",
    image: "/team/carla.jpg"
  },
  {
    name: "Od. Julieta Azcua",
    specialties: "Endodoncias - Protesis - Estetica - Odontologia general",
    image: "/team/julieta.jpg"
  },
  {
    name: "Od. Maria Diaz",
    specialties: "Odontopediatria - Odontologia general - Operatoria dental",
    image: "/team/maria.jpg"
  },
  {
    name: "Od. Natalia Ojeda",
    specialties: "Odontologia general - Estetica - Extracciones",
    image: "/team/natalia.jpg"
  },
]

export function Team() {
  return (
    <section id="equipo" className="py-20 md:py-28 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
            Nuestro equipo
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Profesionales comprometidos con tu salud bucal
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {team.map((member) => (
            <Card key={member.name} className="overflow-hidden border-border hover:shadow-lg transition-shadow">
              <div className="aspect-[4/5] bg-muted relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-3xl font-serif text-primary">
                      {member.name.split(' ')[1]?.[0] || member.name[0]}
                    </span>
                  </div>
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-foreground mb-2">{member.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{member.specialties}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
