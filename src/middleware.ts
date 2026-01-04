import { auth } from '@/auth'

export default auth

// Configuración específica del middleware de NextAuth.js
export const config = {
  // Aplicar middleware a rutas que comiencen con /dashboard
  matcher: ['/dashboard/:path*'],
}
