"use server"

import { auth } from "@/auth"
import { CredentialsSignin } from "next-auth"
import type {
  AuthTokensResponseDto,
  LoginDto,
  RegisterDto,
  MeResponseDto,
  MeApiResponse,
} from "@/lib/types/auth"

const getBaseUrl = () => {
  const url = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL
  if (!url) throw new Error("BACKEND_URL is not set")
  return url.replace(/\/$/, "")
}

/** Fetches current user and sessions from backend GET /api/users/me. */
export async function getMeAction(): Promise<MeResponseDto | null> {
  const session = await auth()
  const token =
    session?.accessToken ?? (session as { accessToken?: string })?.accessToken
  if (!token) return null
  try {
    const baseUrl = getBaseUrl()
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    })
    if (!res.ok) return null
    const data = (await res.json().catch(() => null)) as MeApiResponse | null
    if (!data?.id) return null
    console.log("[getMeAction] step: response body", data)
    const me: MeResponseDto = {
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        emailVerified: data.emailVerified,
        image: data.image,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      },
      sessions: data.sessions ?? [],
      accounts: data.accounts ?? [],
    }
    return me
  } catch {
    return null
  }
}

export async function loginAction(
  credentials: LoginDto
): Promise<AuthTokensResponseDto> {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/auth/login`
    console.log("[loginAction] step: start", { email: credentials.email })
    console.log("[loginAction] step: fetching", { url })
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    })
    console.log("[loginAction] step: response", {
      status: res.status,
      statusText: res.statusText,
    })
    const data = await res.json().catch(() => ({}))
    console.log("[loginAction] step: response body", data)
    if (res.status === 401) {
      throw new CredentialsSignin("Invalid email or password")
    }
    if (!res.ok) {
      throw new Error("Login failed")
    }
    console.log("[loginAction] step: success")
    return data as AuthTokensResponseDto
  } catch (err) {
    console.log("[loginAction] step: error", err)
    throw err
  }
}

export async function signupAction(
  body: RegisterDto
): Promise<AuthTokensResponseDto> {
  try {
    const baseUrl = getBaseUrl()
    const url = `${baseUrl}/api/auth/register`
    console.log("[signupAction] step: start", { email: body.email, name: body.name })
    console.log("[signupAction] step: fetching", { url })
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    console.log("[signupAction] step: response", {
      status: res.status,
      statusText: res.statusText,
    })
    const data = await res.json().catch(() => ({}))
    console.log("[signupAction] step: response body", data)
    if (res.status === 409) {
      throw new Error("Email already exists")
    }
    if (!res.ok) {
      throw new Error("Registration failed")
    }
    console.log("[signupAction] step: success")
    return data as AuthTokensResponseDto
  } catch (err) {
    console.log("[signupAction] step: error", err)
    throw err
  }
}
