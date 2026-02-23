import { NextResponse } from "next/server"
import { auth } from "@/auth"

const getBaseUrl = () => {
  const url = process.env.NEXT_PUBLIC_BACKEND_URL ?? process.env.BACKEND_URL
  if (!url) throw new Error("BACKEND_URL is not set")
  return url.replace(/\/$/, "")
}

/** GET /api/me – proxy to backend /me with session token (ensures cookie is sent). */
export async function GET() {
  const session = await auth()
  const token =
    session?.accessToken ?? (session as { accessToken?: string })?.accessToken
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    const data = await res.json().catch(() => null)
    if (!res.ok) {
      return NextResponse.json(data ?? { error: "Backend error" }, {
        status: res.status,
      })
    }
    return NextResponse.json(data)
  } catch (err) {
    console.error("[GET /api/me]", err)
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 502 }
    )
  }
}
