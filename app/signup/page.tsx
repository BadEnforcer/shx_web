"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectAuthStatus } from "@/lib/store/slices/authSlice"
import { SignupForm } from "./SignupForm"

export default function SignupPage() {
  const router = useRouter()
  const status = useSelector(selectAuthStatus)

  useEffect(() => {
    if (status === "authenticated") router.replace("/profile")
  }, [status, router])

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center">
        <div className="w-full max-w-sm rounded-xl bg-muted/30 animate-pulse h-96" />
      </div>
    )
  }

  if (status === "authenticated") return null

  return <SignupForm />
}
