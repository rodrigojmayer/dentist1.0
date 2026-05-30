import { useMemo } from "react"

interface UseTodayProps {
  from?: string
  to?: string
}

export function useToday({ from, to }: UseTodayProps = {}) {
  // Calculamos la fecha de hoy en formato local de forma segura
  const fechaHoyString = useMemo(() => {
    const hoy = new Date()
    const anio = hoy.getFullYear()
    const mes = String(hoy.getMonth() + 1).padStart(2, '0')
    const dia = String(hoy.getDate()).padStart(2, '0')
    return `${anio}-${mes}-${dia}` // Retorna "YYYY-MM-DD"
  }, [])

  // Si se pasan parámetros de fecha, evalúa si coinciden con el día de hoy
  const hoySelected = from === fechaHoyString && to === fechaHoyString

  return {
    fechaHoyString,
    hoySelected,
  }
}