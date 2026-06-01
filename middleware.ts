import { updateSession } from '@/lib/supabase/proxy'
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // 1. Primero ejecutamos tu lógica actual de Supabase para refrescar la sesión
  let response = await updateSession(request)
  
  // 2. Si la ruta que está intentando visitar empieza con /admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    
    // Necesitamos crear una instancia rápida del cliente de Supabase para leer el usuario en el servidor
    // Nota: Si 'updateSession' ya te devuelve el objeto 'supabase' o la sesión, podrías usarla,
    // pero esta es la forma estándar de leerla de forma segura en Next.js:
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // Seteamos tanto en el request como en la response para mantener la sincronía
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set({ name, value, ...options })
              // Creamos una nueva respuesta intermedia si necesitamos mutar cookies
              response = NextResponse.next({
                request: {
                  headers: request.headers,
                },
              })
              response.cookies.set({ name, value, ...options })
            })
          },
        },
      }
    )
  
  // Obtenemos el usuario actual de forma segura desde el backend de Supabase
    const { data: { user } } = await supabase.auth.getUser()
    // 5. Limpiamos espacios fantasmas y pasamos todo a minúsculas para evitar fallos de tipeo
    const allowedEmails = process.env.ADMIN_EMAILS?.split(",").map(email => email.trim().toLowerCase()) || []
    console.log("email allowed:", allowedEmails)
    console.log("user:", user)
    // Si no está logueado o su email no está en la lista de administradores, lo rebotamos
    if (!user || !user.email || !allowedEmails.includes(user.email)) {
      // Redirige a una página de "No autorizado" o al login principal
      const url = request.nextUrl.clone()
      url.pathname = '/unauthorized' // Asegurate de tener esta página o cambiala por '/'
      
      const redirectResponse = NextResponse.redirect(url)
      
      // IMPORTANTÍSIMO: Copiamos las cookies de sesión que updateSession haya generado
      // a la respuesta de redirección, para no perder el login del usuario aunque lo rebotemos
      response.cookies.getAll().forEach((cookie) => {
        redirectResponse.cookies.set(cookie.name, cookie.value)
      })
      
      return redirectResponse
    }
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
