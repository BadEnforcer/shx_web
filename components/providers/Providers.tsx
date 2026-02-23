"use client"

import { Suspense } from "react"
import { Provider } from "react-redux"
import { SessionProvider } from "next-auth/react"
import { store } from "@/lib/store"
import { AuthSync } from "@/components/auth/AuthSync"

function GlobalFallback() {
  return (
    <div className="min-h-[calc(100vh-2rem)] flex items-center justify-center">
      <div className="animate-pulse rounded-full h-8 w-8 bg-muted-foreground/20" />
    </div>
  )
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>
        <AuthSync />
        <Suspense fallback={<GlobalFallback />}>{children}</Suspense>
      </SessionProvider>
    </Provider>
  )
}
