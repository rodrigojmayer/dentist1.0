import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { nextUrl } = request
  const searchParams = nextUrl.searchParams
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/admin'

  console.log("=== [CALLBACK START] ===")
  console.log("Código de OAuth recibido:", code ? "SÍ (Existe)" : "NO")
  console.log("Ruta de destino final (next):", next)

  // Creás una respuesta base vacía para poder escribirle las cookies arriba
  const response = NextResponse.redirect(`${nextUrl.origin}${next}`)

  if (code) {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            // 🌟 SOLUCIÓN AL BUG: Para que el navegador guarde la sesión,
            // las cookies se tienen que setear en la RESPUESTA (response), no en el request.
            cookiesToSet.forEach(({ name, value, options }) => {
              request.cookies.set({ name, value, ...options }) // Sincroniza localmente
              response.cookies.set({ name, value, ...options }) // Se envía al navegador
            })
          },
        },
      }
    )
    
    console.log("Intercambiando código por sesión en Supabase...")
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error("❌ Error en exchangeCodeForSession:", error.message)
      return NextResponse.redirect(`${nextUrl.origin}/unauthorized?reason=auth_error`)
    }

    console.log("✅ Sesión creada con éxito para el usuario:", data.user?.email)
    console.log("Cookies que se van a enviar al navegador:", response.cookies.getAll().map(c => c.name))
    console.log("=== [CALLBACK END SUCCESS] ===")
    
    // Retornás la respuesta que YA TIENE las cookies inyectadas por setAll
    return response
  }

  console.warn("⚠️ No se detectó ningún código de OAuth en la URL")
  console.log("=== [CALLBACK END FAIL] ===")
  return NextResponse.redirect(`${nextUrl.origin}/unauthorized?reason=no_code`)
}