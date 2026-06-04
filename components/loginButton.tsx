"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client" // 👈 Asegurate que esta ruta apunte a tu creador de cliente de Supabase
import { Mail, Loader2 } from "lucide-react"

export function LoginAdminButton() {
    const [email, setEmail] = useState("")
    const [loadingGoogle, setLoadingGoogle] = useState(false)
    const [loadingMagic, setLoadingMagic] = useState(false)
    const supabase = createClient()

    // 1. Manejo del Login con Google
    const handleGoogleLogin = async () => {
        setLoadingGoogle(true)
        try {
            await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    // Le avisamos a Supabase a dónde tiene que mandar al usuario tras loguearse
                    // redirectTo: `${window.location.origin}/auth/callback?next=/admin`,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'select_account', // Te permite elegir qué cuenta de Gmail usar si tenés varias abiertas
                    },
                },
            })
        } catch (error) {
            console.error("Error Google Auth: ", error)
            setLoadingGoogle(false)
        }
    }

    // 2. Manejo del Magic Link
    const handleMagicLinkLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) return

        setLoadingMagic(true)
        try {
        const { error } = await supabase.auth.signInWithOtp({
            email: email,
            options: {
            // Próximo paso: crear este callback para procesar el token que viaja en el mail
            emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        })

        if (error) throw error

        alert("¡Revisá tu correo! Te enviamos un enlace mágico de acceso.")
        setEmail("") // Limpiamos el input
        } catch (error: any) {
        alert(`Error al enviar el enlace: ${error.message}`)
        } finally {
        setLoadingMagic(false)
        }
    }

    return (
       <div className="flex flex-col gap-4 p-4 w-full min-w-[240px]">
      {/* SECCIÓN 1: LOGIN TRADICIONAL CON GOOGLE */}
      <Button 
        onClick={handleGoogleLogin} 
        variant="outline" 
        // className="w-full cursor-pointer gap-2 text-muted hover:text-primary bg-primary hover:bg-muted"
        className="w-full gap-2 bg-white text-slate-700 border border-slate-200 hover:bg-primary/20 hover:text-primary cursor-pointer"
        disabled={loadingGoogle || loadingMagic}
      >
        {loadingGoogle ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
            <svg className="h-4 w-4" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path
                    fill="#EA4335"
                    d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.866-3.577-7.866-8s3.536-8 7.866-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.11C18.432 2.23 15.608 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.745-.078-1.32-.176-1.714H12.24z"
                />
                <path
                    fill="#FBBC05"
                    d="M1 12.24c0-1.536.313-2.993.863-4.325L1.75 4.75l-4.14 3.2C-3.23 9.47-3.5 10.83-3.5 12.24s.27 2.77.84 4.09l4.24-3.26c-.45-1.26-.74-2.61-.74-4.09z"
                    className="hidden" 
                />
                <g>
                    <path
                        fill="#EA4335"
                        d="M12 5.04c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 1.68 14.97 1 12 1 7.34 1 3.36 3.68 1.41 7.62l4.14 3.21c.96-2.88 3.66-5.79 6.45-5.79z"
                    />
                    <path
                        fill="#34A853"
                        d="M12 18.96c-2.79 0-5.49-2.91-6.45-5.79l-4.14 3.21C3.36 20.32 7.34 23 12 23c2.97 0 5.46-.98 7.28-2.66l-3.47-2.7c-1.04.68-2.32 1.32-3.81 1.32z"
                    />
                    <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31l3.47 2.7c2.03-1.87 3.38-4.63 3.38-8.02z"
                    />
                    <path
                        fill="#FBBC05"
                        d="M5.55 13.17c-.24-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29L1.41 7.62C.51 9.43 0 11.45 0 13.56s.51 4.13 1.41 5.94l4.14-3.21z"
                    />
                </g>
            </svg>
        )}
        Continuar con Google
    </Button>

      {/* SEPARADOR VISUAL */}
      <div className="relative flex py-1 items-center font-normal">
        <div className="flex-grow border-t border-border/60"></div>
        <span className="flex-shrink mx-3 text-[11px] text-muted-foreground uppercase tracking-wider">ó bien</span>
        <div className="flex-grow border-t border-border/60"></div>
      </div>

      {/* SECCIÓN 2: FORMULARIO DE MAGIC LINK */}
      <form onSubmit={handleMagicLinkLogin} className="flex flex-col gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="magic-email" className="text-[11px] font-medium text-muted-foreground pl-0.5">
            Ingreso sin contraseña por Email
          </label>
          <input
            id="magic-email"
            type="email"
            placeholder="ejemplo@correo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loadingGoogle || loadingMagic}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary text-foreground disabled:opacity-50"
          />
        </div>
        <Button 
          type="submit" 
          size="sm" 
          className="w-full gap-1.5 cursor-pointer font-medium"
          disabled={loadingGoogle || loadingMagic || !email}
        >
          {loadingMagic ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Mail className="h-3.5 w-3.5" />
          )}
          {loadingMagic ? "Enviando..." : "Enviar enlace de acceso"}
        </Button>
      </form>
    </div>
  )
}