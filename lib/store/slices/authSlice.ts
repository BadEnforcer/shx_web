import { createSlice } from "@reduxjs/toolkit"
import type { Session } from "next-auth"

/** Serializable session shape for Redux (matches next-auth Session). */
export interface AuthSession {
  user: {
    id: string
    name: string
    email: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: string
    updatedAt?: string
  }
  expires?: string
  accessToken?: string
  refreshToken?: string
}

export type AuthStatus =
  | "idle"
  | "loading"
  | "authenticated"
  | "unauthenticated"

interface AuthState {
  session: AuthSession | null
  status: AuthStatus
}

const initialState: AuthState = {
  session: null,
  status: "idle",
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setSession(state, action: { payload: AuthSession | null }) {
      state.session = action.payload
      state.status = action.payload ? "authenticated" : "unauthenticated"
    },
    setStatus(state, action: { payload: AuthStatus }) {
      state.status = action.payload
    },
    clearSession(state) {
      state.session = null
      state.status = "unauthenticated"
    },
  },
})

export const { setSession, setStatus, clearSession } = authSlice.actions
export default authSlice.reducer

export const selectSession = (state: { auth: AuthState }) => state.auth.session
export const selectAuthStatus = (state: { auth: AuthState }) => state.auth.status
export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.status === "authenticated"

export function toAuthSession(session: Session | null): AuthSession | null {
  if (!session?.user) return null
  return {
    user: {
      id: session.user.id ?? "",
      name: session.user.name ?? "",
      email: session.user.email ?? "",
      emailVerified: session.user.emailVerified,
      image: session.user.image,
      createdAt: session.user.createdAt,
      updatedAt: session.user.updatedAt,
    },
    expires:
      typeof session.expires === "string"
        ? session.expires
        : session.expires != null && typeof (session.expires as Date).toISOString === "function"
          ? (session.expires as Date).toISOString()
          : undefined,
    accessToken: (session as Session & { accessToken?: string }).accessToken,
    refreshToken: (session as Session & { refreshToken?: string }).refreshToken,
  }
}
