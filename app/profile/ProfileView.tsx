"use client"

import { signOut } from "next-auth/react"
import type { Session } from "next-auth"

interface ProfileViewProps {
  session: Session
}

export function ProfileView({ session }: ProfileViewProps) {
  return (
    <div className="max-w-2xl mx-auto mt-8 p-4">
      <h1 className="text-xl font-semibold mb-4">Profile</h1>
      <p className="font-medium">{session.user?.name}</p>
      <pre className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded overflow-auto text-sm whitespace-pre-wrap">
        {JSON.stringify(session, null, 2)}
      </pre>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/login" })}
        className="mt-4 border rounded px-3 py-2 bg-black text-white"
      >
        Logout
      </button>
    </div>
  )
}
