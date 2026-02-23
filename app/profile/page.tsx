"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { selectAuthStatus } from "@/lib/store/slices/authSlice"
import { ProfileView } from "./ProfileView"

export default function ProfilePage() {
  const router = useRouter()
  const status = useSelector(selectAuthStatus)

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/login")
    }
  }, [status, router])

  if (status === "loading" || status === "idle") {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 space-y-4">
        <div className="h-7 w-32 bg-muted/30 rounded animate-pulse" />
        <div className="h-5 w-48 bg-muted/30 rounded animate-pulse" />
        <div className="h-40 bg-muted/30 rounded animate-pulse" />
      </div>
    )
  }

  if (status === "unauthenticated") return null

  return <ProfileView />
}
