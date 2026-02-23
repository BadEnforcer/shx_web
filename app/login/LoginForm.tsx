"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { CredentialsSignin } from "next-auth"

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [message, setMessage] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage(null)
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const fieldErrors: { email?: string; password?: string } = {}
      parsed.error.issues.forEach((err) => {
        const path = err.path[0] as string
        if (path in fieldErrors) return
        ;(fieldErrors as Record<string, string>)[path] = err.message
      })
      setErrors(fieldErrors)
      return
    }
    setErrors({})
    try {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        callbackUrl: "/profile",
        redirect: false,
      })
      if (result?.error) {
        setMessage("Invalid email or password")
        return
      }
      if (result?.ok) {
        router.push("/profile")
        router.refresh()
      }
    } catch (err) {
      if (err instanceof CredentialsSignin) {
        setMessage("Invalid email or password")
      } else {
        setMessage("Something went wrong")
      }
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-sm mx-auto mt-8 p-4">
      <h1 className="text-xl font-semibold">Log in</h1>
      {message && <p className="text-red-600 text-sm">{message}</p>}
      <div className="flex flex-col gap-1">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded px-3 py-2"
          autoComplete="email"
        />
        {errors.email && <p className="text-red-600 text-sm">{errors.email}</p>}
      </div>
      <div className="flex flex-col gap-1">
        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded px-3 py-2"
          autoComplete="current-password"
        />
        {errors.password && <p className="text-red-600 text-sm">{errors.password}</p>}
      </div>
      <button type="submit" className="border rounded px-3 py-2 bg-black text-white">
        Log in
      </button>
    </form>
  )
}
