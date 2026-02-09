export interface Professional {
  id: string
  name: string
  specialties: string[]
  availableLocations: string[]
}

export interface Location {
  id: string
  city: string
  address: string
  phone: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface Appointment {
  id: string
  patientName: string
  patientEmail: string
  patientPhone: string
  professionalId: string
  locationId: string
  date: string
  time: string
  notes?: string
  status: "pending" | "confirmed" | "cancelled" | "deleted"
  createdAt: string
}

export const professionals: Professional[] = [
  {
    id: "anabela-martinez",
    name: "Od. Anabela Martinez",
    specialties: ["Alineadores invisibles", "Ortodoncia", "Botox", "Odontopediatria", "Odontologia general"],
    availableLocations: ["rosario", "funes"]
  },
  {
    id: "mailen-luque",
    name: "Od. Mailen Luque",
    specialties: ["Cirugias", "Implantes", "Coronas sobre implantes", "Frenectomias", "Gingivectomias", "Extracciones"],
    availableLocations: ["rosario", "san-lorenzo"]
  },
  {
    id: "sofia-fanelli",
    name: "Od. Sofia Fanelli",
    specialties: ["Protesis", "Estetica", "Tratamientos de conducto", "Extracciones", "Odontologia general"],
    availableLocations: ["rosario", "funes"]
  },
  {
    id: "daiana-lovino",
    name: "Od. Daiana Lovino",
    specialties: ["Ortodoncia", "Ortopedia", "Alineadores invisibles"],
    availableLocations: ["funes", "san-lorenzo"]
  },
  {
    id: "aldana-arroniz",
    name: "Od. Aldana Arroniz",
    specialties: ["Endodoncias", "Protesis", "Estetica", "Odontologia general"],
    availableLocations: ["rosario"]
  },
  {
    id: "mara-marin",
    name: "Od. Mara Marin",
    specialties: ["Odontopediatria", "Odontologia general", "Operatoria dental"],
    availableLocations: ["san-lorenzo", "funes"]
  },
  {
    id: "natasha-paulochenka",
    name: "Od. Natasha Paulochenka",
    specialties: ["Odontologia general", "Estetica", "Extracciones"],
    availableLocations: ["rosario", "san-lorenzo"]
  },
]

export const locations: Location[] = [
  {
    id: "funes",
    city: "Funes",
    address: "Catamarca 1762",
    phone: "3412427286"
  },
  {
    id: "rosario",
    city: "Rosario",
    address: "9 de Julio 1209",
    phone: "3412722087"
  },
  {
    id: "san-lorenzo",
    city: "San Lorenzo",
    address: "Bv. Urquiza",
    phone: "3476210367"
  },
]

export function generateTimeSlots(date: string, bookedTimes: string[] = []): TimeSlot[] {
  const slots: TimeSlot[] = []
  const startHour = 9
  const endHour = 18
  
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minutes = 0; minutes < 60; minutes += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
      slots.push({
        time,
        available: !bookedTimes.includes(time)
      })
    }
  }
  
  return slots
}
