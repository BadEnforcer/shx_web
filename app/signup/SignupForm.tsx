"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { z } from "zod"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { signupAction } from "@/lib/actions/auth"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldContent, FieldError } from "@/components/ui/field"

const signupSchema = z.object({
  email: z.email("Invalid email"),
  name: z.string().min(1, "Name is required"),
  password: z.string().min(1, "Password is required"),
})

export function SignupForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [errors, setErrors] = useState<{ email?: string; name?: string; password?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault()
    const parsed = signupSchema.safeParse({ email, name, password })
    if (!parsed.success) {
      const fieldErrors: { email?: string; name?: string; password?: string } = {}
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
      const res = await signupAction(parsed.data)
      const result = await signIn("credentials", {
        email: res.user.email,
        password: parsed.data.password,
        callbackUrl: "/profile",
        redirect: false,
      })
      if (result?.ok) {
        toast.success("Account created")
        router.push("/profile")
        router.refresh()
      } else {
        toast.success("Account created. Please log in.")
        router.push("/login")
        router.refresh()
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-2rem)] flex flex-col items-center justify-center px-4 py-8">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign up</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <CardContent className="flex flex-col gap-4">
            <Field>
              <FieldLabel htmlFor="signup-name">Name</FieldLabel>
              <FieldContent>
                <Input
                  id="signup-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value)
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }))
                  }}
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                />
                <FieldError>{errors.name}</FieldError>
              </FieldContent>
            </Field>
            <Field>
              <FieldLabel htmlFor="signup-email">Email</FieldLabel>
              <FieldContent>
                <Input
                  id="signup-email"
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
              <FieldLabel htmlFor="signup-password">Password</FieldLabel>
              <FieldContent>
                <Input
                  id="signup-password"
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value)
                    if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }))
                  }}
                  autoComplete="new-password"
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
                  Signing up…
                </>
              ) : (
                "Sign up"
              )}
            </Button>
            <p className="text-muted-foreground text-sm text-center">
              Already have an account?{" "}
              <Link href="/login" className="text-primary underline-offset-4 hover:underline">
                Log in
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
