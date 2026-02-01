"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { StepIndicator } from "./step-indicator"
import { LocationStep } from "./location-step"
import { ProfessionalStep } from "./professional-step"
import { DateTimeStep } from "./datetime-step"
import { PatientInfoStep } from "./patient-info-step"
import { ConfirmationStep } from "./confirmation-step"
import type { Appointment } from "@/lib/types"

export type BookingStep = "location" | "professional" | "datetime" | "patient" | "confirmation"

export interface BookingData {
  locationId: string
  professionalId: string
  date: string
  time: string
  patientName: string
  patientEmail: string
  patientPhone: string
  notes: string
}

const initialData: BookingData = {
  locationId: "",
  professionalId: "",
  date: "",
  time: "",
  patientName: "",
  patientEmail: "",
  patientPhone: "",
  notes: ""
}

export function BookingForm() {
  const [step, setStep] = useState<BookingStep>("location")
  const [data, setData] = useState<BookingData>(initialData)
  const [appointment, setAppointment] = useState<Appointment | null>(null)

  const updateData = (updates: Partial<BookingData>) => {
    setData(prev => ({ ...prev, ...updates }))
  }

  const handleSubmit = async () => {
    console.log("BookingForm handleSubmitdata: ", data)
    try {
      const response = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Error al crear el turno")
      }
      
      const result = await response.json()
      setAppointment(result.appointment)
      setStep("confirmation")
    } catch (error) {
      alert(error instanceof Error ? error.message : "Error al crear el turno")
    }
  }

  const resetForm = () => {
    setData(initialData)
    setAppointment(null)
    setStep("location")
  }

  return (
    <Card className="border-border shadow-lg">
      <CardContent className="p-6 md:p-8">
        {step !== "confirmation" && (
          <StepIndicator currentStep={step} />
        )}
        
        {step === "location" && (
          <LocationStep
            selectedLocation={data.locationId}
            onSelect={(locationId) => {
              updateData({ locationId, professionalId: "", date: "", time: "" })
              setStep("professional")
            }}
          />
        )}
        
        {step === "professional" && (
          <ProfessionalStep
            locationId={data.locationId}
            selectedProfessional={data.professionalId}
            onSelect={(professionalId) => {
              updateData({ professionalId, date: "", time: "" })
              setStep("datetime")
            }}
            onBack={() => setStep("location")}
          />
        )}
        
        {step === "datetime" && (
          <DateTimeStep
            professionalId={data.professionalId}
            locationId={data.locationId}
            selectedDate={data.date}
            selectedTime={data.time}
            onSelect={(date, time) => {
              updateData({ date, time })
              setStep("patient")
            }}
            onBack={() => setStep("professional")}
          />
        )}
        
        {step === "patient" && (
          <PatientInfoStep
            data={data}
            onUpdate={updateData}
            onSubmit={handleSubmit}
            onBack={() => setStep("datetime")}
          />
        )}
        
        {step === "confirmation" && appointment && (
          <ConfirmationStep
            appointment={appointment}
            onNewBooking={resetForm}
          />
        )}
      </CardContent>
    </Card>
  )
}
