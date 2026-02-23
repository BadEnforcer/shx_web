import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    name: string
    email: string
    emailVerified: boolean
    image?: string | null
    createdAt: string
    updatedAt: string
    accessToken?: string
    refreshToken?: string
  }

  interface Session extends DefaultSession {
    user: User
    accessToken?: string
    refreshToken?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    name?: string
    email?: string
    emailVerified?: boolean
    image?: string | null
    createdAt?: string
    updatedAt?: string
    accessToken?: string
    refreshToken?: string
  }
}
