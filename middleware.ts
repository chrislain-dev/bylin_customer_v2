import { NextResponse } from "next/server";

// Activez ou désactivez ici
const IS_MAINTENANCE_MODE = true;

export function middleware(request) {
  if (IS_MAINTENANCE_MODE) {
    // Option A : Retourner un texte ou HTML directement avec un code HTTP 503
    return new NextResponse(
      "<h1>Application en Maintenance</h1><p>Nous revenons très vite !</p>",
      { status: 503, headers: { "content-type": "text/html; charset=utf-8" } },
    );
  }
  return NextResponse.next();
}

// Configurer pour que le middleware s'applique à TOUTES les pages
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
