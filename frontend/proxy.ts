import { NextRequest, NextResponse } from "next/server"

const AUTH_ROUTES = ["/login", "/signup"]
const PROTECTED_ROUTES = ["/my-images", "/resize"]

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  const accessToken = req.cookies.get("access_token")?.value

  if (accessToken && AUTH_ROUTES.includes(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/"
    return NextResponse.redirect(url)
  }

  if (!accessToken && PROTECTED_ROUTES.includes(pathname)) {
    const url = req.nextUrl.clone()
    url.pathname = "/login"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}
