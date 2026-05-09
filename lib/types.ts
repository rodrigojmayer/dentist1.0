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
    id: "ana-marquez",
    name: "Od. Ana Marquez",
    specialties: ["Alineadores invisibles", "Ortodoncia", "Botox", "Odontopediatria", "Odontologia general"],
    // availableLocations: ["rosario", "funes"]
    availableLocations: ["san-lorenzo"]
  },
  {
    id: "mailen-luque",
    name: "Od. Mailen Luque",
    specialties: ["Cirugias", "Implantes", "Coronas sobre implantes", "Frenectomias", "Gingivectomias", "Extracciones"],
    // availableLocations: ["rosario", "san-lorenzo"]
    availableLocations: ["san-lorenzo"]
  },
  {
    id: "erica-fani",
    name: "Od. Erica Fani",
    specialties: ["Protesis", "Estetica", "Tratamientos de conducto", "Extracciones", "Odontologia general"],
    // availableLocations: ["rosario", "funes"]
    availableLocations: ["san-lorenzo"]
  },
  {
    id: "carla-perez",
    name: "Od. Carla Perez",
    specialties: ["Ortodoncia", "Alineadores invisibles"],
    // availableLocations: ["funes", "san-lorenzo"]
    availableLocations: ["san-lorenzo"]
  },
  {
    id: "julieta-azcua",
    name: "Od. Julieta Azcua",
    specialties: ["Endodoncias", "Protesis", "Estetica", "Odontologia general"],
    // availableLocations: ["rosario"]
    availableLocations: ["san-lorenzo"]
  },
  {
    id: "maria-diaz",
    name: "Od. Maria Diaz",
    specialties: ["Odontopediatria", "Odontologia general", "Operatoria dental"],
    // availableLocations: ["san-lorenzo", "funes"]
    availableLocations: ["san-lorenzo"]
  },
  {
    id: "natalia-ojeda",
    name: "Od. Natalia Ojeda",
    specialties: ["Odontologia general", "Estetica", "Extracciones"],
    // availableLocations: ["rosario", "san-lorenzo"]
    availableLocations: ["san-lorenzo"]
  },
]

export const locations: Location[] = [
  // {
  //   id: "funes",
  //   city: "Funes",
  //   address: "Catamarca 1762",
  //   phone: "3412427286"
  // },
  // {
  //   id: "rosario",
  //   city: "Rosario",
  //   address: "9 de Julio 1209",
  //   phone: "3412722087"
  // },
  {
    id: "san-lorenzo",
    city: "San Lorenzo",
    address: "Sgto. Cabral 1465",
    phone: "03476316589",
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
