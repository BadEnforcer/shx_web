"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { signOut } from "next-auth/react"
import { useSelector, useDispatch } from "react-redux"
import { selectSession, clearSession } from "@/lib/store/slices/authSlice"
import {
  MeResponseDto,
  SessionItemDto,
  AccountItemDto,
} from "@/lib/types/auth"
import { getMeAction } from "@/lib/actions/auth"
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

function formatDate(iso?: string): string {
  if (!iso) return "—"
  try {
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(iso))
  } catch {
    return iso
  }
}

function sessionLabel(s: SessionItemDto): string {
  return `Session ${s.id.slice(0, 8)}`
}

export function ProfileView() {
  const reduxSession = useSelector(selectSession)
  const dispatch = useDispatch()
  const [me, setMe] = useState<MeResponseDto | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSigningOut, setIsSigningOut] = useState(false)

  useEffect(() => {
    let mounted = true
    async function load() {
      try {
        const meData = await getMeAction()
        console.log('meData', meData)
        if (meData?.user?.id) {
          setMe({
            user: {
              id: meData.user.id,
              name: meData.user.name,
              email: meData.user.email,
              emailVerified: meData.user.emailVerified,
              image: meData.user.image,
              createdAt: meData.user.createdAt,
              updatedAt: meData.user.updatedAt,
            },
            sessions: meData.sessions ?? [],
            accounts: meData.accounts ?? [],
          })
        } else if (reduxSession?.user) {
          setMe({
            user: {
              id: reduxSession.user.id,
              name: reduxSession.user.name ?? "",
              email: reduxSession.user.email ?? "",
              emailVerified: reduxSession.user.emailVerified ?? false,
              image: reduxSession.user.image,
              createdAt: reduxSession.user.createdAt ?? "",
              updatedAt: reduxSession.user.updatedAt ?? "",
            },
            sessions: [],
            accounts: [],
          })
        }
      } finally {
        if (mounted) setLoading(false)
      }
    }
    load()
    return () => {
      mounted = false
    }
  }, [reduxSession?.user?.id, reduxSession?.user])

  async function handleSignOut() {
    setIsSigningOut(true)
    try {
      dispatch(clearSession())
      await signOut({ callbackUrl: "/login" })
      toast.success("Signed out")
    } catch {
      toast.error("Could not sign out")
    } finally {
      setIsSigningOut(false)
    }
  }

  if (!reduxSession && !me) return null
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-4 space-y-4">
        <div className="h-32 w-full max-w-md bg-muted/30 rounded-xl animate-pulse" />
        <div className="h-48 w-full bg-muted/30 rounded-xl animate-pulse" />
      </div>
    )
  }

  const user = me?.user ?? reduxSession?.user
  if (!user) return null

  const sessions = me?.sessions ?? []
  const accounts = me?.accounts ?? []

  return (
    <div className="max-w-2xl mx-auto mt-8 p-4 space-y-6">
      {/* User card – from /me API when available */}
      <Card>
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full bg-muted">
            {user.image ? (
              <Image
                src={user.image}
                alt=""
                fill
                className="object-cover"
                sizes="64px"
                unoptimized
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-2xl font-medium text-muted-foreground">
                {(user.name ?? user.email ?? "?").slice(0, 1).toUpperCase()}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <CardTitle className="text-xl">{user.name || "No name"}</CardTitle>
            <CardDescription className="flex flex-wrap items-center gap-2">
              <span>{user.email}</span>
              {user.emailVerified !== false && (
                <Badge variant="secondary" className="text-xs">
                  Verified
                </Badge>
              )}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <dl className="grid gap-2">
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">User ID</dt>
              <dd className="font-mono text-xs max-w-[20rem]" title={user.id}>
                {user.id}
              </dd>
            </div>
            <Separator />
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Created</dt>
              <dd>{formatDate(user.createdAt)}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted-foreground">Updated</dt>
              <dd>{formatDate(user.updatedAt)}</dd>
            </div>
          </dl>
        </CardContent>
        <CardFooter>
          <Button
            variant="outline"
            onClick={() => handleSignOut()}
            disabled={isSigningOut}
          >
            {isSigningOut ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" aria-hidden />
                Signing out…
              </>
            ) : (
              "Sign out"
            )}
          </Button>
        </CardFooter>
      </Card>

      {/* Sessions from /me API */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            Sessions
            <Badge variant="secondary" className="text-xs font-normal">
              /me API
            </Badge>
          </CardTitle>
          <CardDescription>
            Active sessions ({sessions.length}). Created, updated, and expiry.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No sessions to show.
            </p>
          ) : (
            <ul className="space-y-3">
              {sessions.map((s) => (
                <li
                  key={s.id}
                  className="rounded-lg border bg-muted/20 p-3 text-sm space-y-2"
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="font-medium font-mono text-xs">{sessionLabel(s)}</p>
                    <span className="font-mono text-[10px] text-muted-foreground" title={s.id}>
                      {s.id.slice(0, 8)}…
                    </span>
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    <dt>Created</dt>
                    <dd>{formatDate(s.createdAt)}</dd>
                    <dt>Updated</dt>
                    <dd>{formatDate(s.updatedAt)}</dd>
                    <dt>Expires</dt>
                    <dd>{formatDate(s.expiresAt)}</dd>
                    {s.ipAddress != null && s.ipAddress !== "" && (
                      <>
                        <dt>IP</dt>
                        <dd className="font-mono">{s.ipAddress}</dd>
                      </>
                    )}
                    {s.userAgent != null && s.userAgent !== "" && (
                      <>
                        <dt>Device</dt>
                        <dd className="truncate" title={s.userAgent}>{s.userAgent}</dd>
                      </>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Accounts from /me API */}
      {accounts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Linked accounts
              <Badge variant="secondary" className="text-xs font-normal">
                /me API
              </Badge>
            </CardTitle>
            <CardDescription>
              Provider accounts linked to this user.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {(accounts as AccountItemDto[]).map((acc) => (
                <li
                  key={acc.id}
                  className="rounded-lg border bg-muted/20 p-3 text-sm space-y-1"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-medium">{acc.providerId}</span>
                    <span className="font-mono text-xs text-muted-foreground" title={acc.id}>
                      {acc.id.slice(0, 8)}…
                    </span>
                  </div>
                  <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-xs text-muted-foreground">
                    {acc.createdAt && (
                      <>
                        <dt>Created</dt>
                        <dd>{formatDate(acc.createdAt)}</dd>
                      </>
                    )}
                    {acc.updatedAt && (
                      <>
                        <dt>Updated</dt>
                        <dd>{formatDate(acc.updatedAt)}</dd>
                      </>
                    )}
                  </dl>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
