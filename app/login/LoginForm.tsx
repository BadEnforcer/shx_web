"use client"

import { useState } from "react"
import { signIn, getSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { setSession, toAuthSession } from "@/lib/store/slices/authSlice"
import Link from "next/link"
import { z } from "zod"
import { CredentialsSignin } from "next-auth"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"

const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
})

export function LoginForm() {
  const router = useRouter()
  const dispatch = useDispatch()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
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
    setIsSubmitting(true)
    try {
      const result = await signIn("credentials", {
        email: parsed.data.email,
        password: parsed.data.password,
        callbackUrl: "/profile",
        redirect: false,
      })
      if (result?.error) {
        toast.error("Invalid email or password")
        return
      }
      if (result?.ok) {
        const session = await getSession()
        dispatch(setSession(toAuthSession(session)))
        toast.success("Signed in")
        router.push("/profile")
        router.refresh()
      }
    } catch (err) {
      if (err instanceof CredentialsSignin) {
        toast.error("Invalid email or password")
      } else {
        toast.error("Something went wrong")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CardContent className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="login-email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value)
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }))
                  }}
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                />
                <FieldError>{errors.email}</FieldError>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="login-password">Password</FieldLabel>
              <FieldContent>
                <Input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                />
                <FieldError>{errors.password}</FieldError>
              </FieldContent>
            </Field>
          </CardContent>
          <CardFooter className="flex flex-col gap-3 pt-0">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin shrink-0" aria-hidden />
                  Logging in…
                </>
              ) : (
                "Log in"
              )}
            </Button>
            <p className="text-muted-foreground text-sm text-center">
              Don&apos;t have an account?{" "}
              <Link href="/signup" className="text-primary underline-offset-4 hover:underline">
                Sign up
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
