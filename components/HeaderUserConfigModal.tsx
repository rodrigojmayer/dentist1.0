"use client"

import { useState, useEffect } from "react"
import { type User } from "@supabase/supabase-js"
import { createClient } from "@/lib/supabase/client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

interface HeaderUserConfigModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  user: User | null
}

export function HeaderUserConfigModal({ isOpen, onOpenChange, user }: HeaderUserConfigModalProps) {
  const supabase = createClient()
  const [isSaving, setIsSaving] = useState(false)
  
  // Estados para datos del perfil de salud
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [dni, setDni] = useState("")
  const [insurance, setInsurance] = useState("") // Obra social
  const [insuranceNumber, setInsuranceNumber] = useState("") // Nro afiliado

  // Cargar datos actuales
  useEffect(() => {
    if (user && isOpen) {
      const fetchProfileData = async () => {
        const { data } = await supabase
          .from("profiles")
          .select("full_name, phone, dni, insurance, insurance_number")
          .eq("id", user.id)
          .single()
        
        if (data) {
          setFullName(data.full_name || "")
          setPhone(data.phone || "")
          setDni(data.dni || "")
          setInsurance(data.insurance || "")
          setInsuranceNumber(data.insurance_number || "")
        }
      }
      fetchProfileData()
    }
  }, [user, isOpen, supabase])

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setIsSaving(true)

    try {
      const { error } = await supabase
        .from("profiles")
        .update({ 
          full_name: fullName, 
          phone: phone,
          dni: dni,
          insurance: insurance,
          insurance_number: insuranceNumber
        })
        .eq("id", user.id)

      if (error) throw error
      onOpenChange(false) // Cierra el modal al guardar
    } catch (error) {
      console.error("Error al actualizar perfil:", error)
      alert("No se pudieron guardar los cambios.")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px] bg-background border-border p-6">
        <DialogHeader>
          <DialogTitle className="text-xl font-serif font-semibold">Mis Datos Personales</DialogTitle>
          <DialogDescription>
            Mantené tu información actualizada para la gestión de tus turnos médicos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleUpdateProfile} className="space-y-4 pt-2">
          {/* Email - Deshabilitado de muestra */}
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs text-muted-foreground">Correo Electrónico (Google)</Label>
            <Input id="email" type="email" value={user?.email || ""} disabled className="bg-muted/50 opacity-80 h-9" />
          </div>

          {/* Nombre */}
          <div className="space-y-1">
            <Label htmlFor="name">Nombre Completo</Label>
            <Input id="name" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="h-9" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* DNI */}
            <div className="space-y-1">
              <Label htmlFor="dni">DNI</Label>
              <Input id="dni" type="text" placeholder="Ej: 40123456" value={dni} onChange={(e) => setDni(e.target.value)} className="h-9" />
            </div>
            {/* Teléfono */}
            <div className="space-y-1">
              <Label htmlFor="phone">Teléfono Celular</Label>
              <Input id="phone" type="tel" placeholder="Ej: 3416123456" value={phone} onChange={(e) => setPhone(e.target.value)} className="h-9" />
            </div>
          </div>

          <hr className="border-border/60 my-2" />

          {/* Cobertura Médica */}
          <div className="space-y-1">
            <Label htmlFor="insurance">Obra Social / Prepaga</Label>
            <Input id="insurance" type="text" placeholder="Ej: OSDE, Medicus, Particular" value={insurance} onChange={(e) => setInsurance(e.target.value)} className="h-9" />
          </div>

          <div className="space-y-1">
            <Label htmlFor="insurance_num">Número de Afiliado</Label>
            <Input id="insurance_num" type="text" placeholder="Ej: 110-234567-2" value={insuranceNumber} onChange={(e) => setInsuranceNumber(e.target.value)} className="h-9" />
          </div>

          {/* Botonera */}
          <div className="flex gap-3 pt-2 justify-end">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="h-9">
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving} className="h-9 px-5">
              {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Guardar Datos
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}