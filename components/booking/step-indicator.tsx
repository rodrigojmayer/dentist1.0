import type { BookingData, BookingStep } from "./booking-form"
import { cn } from "@/lib/utils"

interface StepIndicatorProps {
  currentStep: BookingStep
  data: BookingData
  onStepChange: (step: BookingStep) => void
}

const steps: { key: BookingStep; label: string }[] = [
  { key: "location", label: "Sucursal" },
  { key: "professional", label: "Profesional" },
  { key: "datetime", label: "Fecha y hora" },
  { key: "patient", label: "Tus datos" },
]

export function StepIndicator({ currentStep,
  data,
  onStepChange }: StepIndicatorProps) {

  const currentIndex = steps.findIndex(s => s.key === currentStep)

  const getStepValue = (stepKey: BookingStep) => {
    switch (stepKey) {
      case "location":
        return data.locationId
      case "professional":
        return data.professionalId
      case "datetime":
        return data.date && data.time
          ? `${data.date} ${data.time}`
          : ""
      case "patient":
        return data.patientName
      default:
        return ""
    }
  }
  
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isClickable = index < currentIndex
          const value = getStepValue(step.key)
          const isCompleted = index < currentIndex
          const isActive = index === currentIndex

          return(
            <div key={step.key} className="flex items-center flex-1">
              <div
                className={cn(
                  "flex flex-col items-center flex-1 transition-all",
                  isClickable && "cursor-pointer hover:opacity-70"
                )}
                onClick={() => {
                  if (isClickable) {
                    onStepChange(step.key)
                  }
                }}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors",
                    index <= currentIndex
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs mt-2 text-center hidden sm:block",
                    index <= currentIndex
                      ? "text-primary font-medium"
                      : "text-muted-foreground"
                  )}
                >
                  {isCompleted && value
                    ? `${step.label}: ${value}`
                    : step.label}
                </span>
              </div>
              {/* {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-0.5 flex-1 mx-2",
                    index < currentIndex ? "bg-primary" : "bg-muted"
                  )}
                />
              )} */}
            </div>
          )
        })}
      </div>
    </div>
  )
}
