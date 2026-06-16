// components/Services.tsx
"use client" // 👈 Esto le avisa a Next.js que acá sí puede usar eventos como onError

import { useState } from "react"
import { Activity, Stethoscope, Baby, Smile, ShieldAlert, Sparkles, Scissors, X } from "lucide-react"

interface Service {
  title: string;
  desc: string;
  image: string;
}

const services: Service[]= [
  {
    title: "IMPLANTES DENTALES",
    desc: "La solución definitiva y natural para reemplazar piezas faltantes mediante pernos de titanio y coronas a medida.",
    image: "/services/Implantes.png"
  },
  {
    title: "ORTOPEDIA",
    desc: "Tratamientos orientados a guiar el crecimiento de los huesos maxilares en niños para una correcta alineación.",
    image: "/services/Ortopedia.png"
  },
  {
    title: "ORTODONCIAS",
    desc: "Corrección de la posición de los dientes y problemas de mordida mediante brackets de última generación.",
    image: "/services/Ortodoncia.png"
  },
  {
    title: "BOTOX para bruxismo",
    desc: "Aplicación terapéutica que alivia de forma drástica la tensión involuntaria y el dolor de mandíbula.",
    image: "/services/BotoxBruxismo.png"
  },
  {
    title: "ODONTOPEDIATRIA",
    desc: "Atención odontológica integral especializada en niños, enfocada en la prevención y en un espacio sin miedos.",
    image: "/services/Odontopediatria.png"
  },
  {
    title: "BLANQUEAMIENTOS",
    desc: "Tratamiento rápido y seguro para aclarar varios tonos el color de tus dientes eliminando manchas.",
    image: "/services/Blanqueamientos.png"
  },
  {
    title: "LIMPIEZA DENTAL",
    desc: "Eliminación profunda de sarro y placa bacteriana mediante ultrasonido para proteger tus encías.",
    image: "/services/LimpiezaDental.png"
  },
  {
    title: "TRAT. DE BRUXISMO",
    desc: "Confección de placas miorrelajantes rígidas a medida para evitar el desgaste dental durante el sueño.",
    image: "/services/TratBruxismo.png"
  },
  {
    title: "PROTESIS REMOVIBLES",
    desc: "Estructuras adaptadas para reemplazar múltiples piezas dentales de forma cómoda y funcional.",
    image: "/services/ProtesisRemovibles.png"
  },
  {
    title: "TRAT. DE CONDUCTOS",
    desc: "Procedimiento preciso para salvar un diente infectado eliminando el dolor por completo.",
    image: "/services/TratdeConducto.png"
  },
  {
    title: "ALINEADORES INVISIBLES",
    desc: "Ortodoncia moderna mediante placas transparentes y removibles, sumamente discretas e higiénicas.",
    image: "/services/Alineadores.png"
  },
  {
    title: "CIRUGIAS BUCALES",
    desc: "Intervenciones quirúrgicas seguras incluyendo extracción de muelas de juicio y tejidos blandos.",
    image: "/services/Cirugia.png"
  },
]

export function Services() {

  const [selectedService, setSelectedService] = useState<Service | null>(null)

  return (
    <section id="servicios" className="py-20 md:py-28 bg-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-20">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            Conoce todos nuestros servicios
          </h2>
          <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">
            Ofrecemos una amplia gama de tratamientos para cuidar tu sonrisa
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-x-6 gap-y-12">
          {services.map((service) => (
            <div 
              key={service.title}
              className="w-full sm:w-[calc(50%-12px)] md:w-[calc(33.333%-16px)] lg:w-[calc(25%-18px)] flex flex-col items-center text-center group"
            >
              <div className="w-40 h-40 rounded-full overflow-hidden border-2 border-primary-foreground/30 bg-primary-foreground/10 mb-6 p-1 transition-transform duration-300 group-hover:scale-105">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title} 
                    className="w-full h-full object-cover scale-104"
                    onError={(e) => { 
                      e.currentTarget.src = 'https://placehold.co/400x400/0f766e/ffffff?text=IOA' 
                    }}
                  />
                </div>
              </div>

              <h3 className="text-primary-foreground font-serif font-bold text-base md:text-lg mb-3 tracking-wide px-2 min-h-[56px] flex items-center justify-center leading-tight">
                {service.title}
              </h3>

              <p className="text-primary-foreground/70 text-xs md:text-sm font-normal leading-relaxed max-w-[240px] mb-5 flex-grow">
                {service.desc}
              </p>

              <button 
                onClick={() => setSelectedService(service)}
                className="bg-[#dfa233] hover:bg-[#c78f2b] text-white text-xs font-semibold uppercase tracking-wider px-5 py-2 rounded shadow-sm transition-colors duration-200">
                Ver más
              </button>
            </div>
          ))}
        </div>
      </div>
      {selectedService && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedService(null)} // Cierra el modal al hacer click en el fondo negro
        >
          <div 
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full overflow-hidden relative transform transition-all duration-300 scale-100 p-6 md:p-8 text-left"
            onClick={(e) => e.stopPropagation()} // Evita que se cierre al hacer click dentro del modal
          >
            {/* Botón de cerrar */}
            <button 
              onClick={() => setSelectedService(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Contenido del Modal */}
            <div className="flex flex-col items-center md:items-start gap-6">
              <div className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-50 p-1 mx-auto md:mx-0">
                <div className="w-full h-full rounded-full overflow-hidden">
                  <img 
                    src={selectedService.image} 
                    alt={selectedService.title} 
                    className="w-full h-full object-cover"
                    onError={(e) => { 
                      e.currentTarget.src = 'https://placehold.co/400x400/0f766e/ffffff?text=IOA' 
                    }}
                  />
                </div>
              </div>

              <div className="w-full">
                <h3 className="font-serif font-bold text-2xl text-gray-900 mb-3 border-b pb-2 tracking-wide">
                  {selectedService.title}
                </h3>
                <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-6">
                  {selectedService.desc}
                </p>
                
                {/* Botón de acción dentro del modal (opcional, como para sacar turno) */}
                <div className="flex justify-end gap-3">
                  <button 
                    onClick={() => setSelectedService(null)}
                    className="border border-gray-300 text-gray-700 text-sm font-medium px-4 py-2 rounded hover:bg-gray-50 transition-colors"
                  >
                    Cerrar
                  </button>
                  <a 
                    href="#contacto" // O tu enlace directo a WhatsApp
                    onClick={() => setSelectedService(null)}
                    className="bg-primary hover:opacity-90 text-white text-sm font-medium px-5 py-2 rounded transition-opacity text-center"
                  >
                    Consultar Turno
                  </a>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  )
}