"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectAuthStatus } from "@/lib/store/slices/authSlice"

export default function Page() {
  const router = useRouter()
  const status = useSelector(selectAuthStatus)

  useEffect(() => {
    if (status === "authenticated") router.replace("/profile")
    else if (status === "unauthenticated") router.replace("/login")
  }, [status, router])

  if (status === "loading" || status === "idle") {
    return (
      <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center">
        <div className="animate-pulse rounded-full h-8 w-8 bg-muted-foreground/20" />
      </div>
    )
  }

  return null
}
