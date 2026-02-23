import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { loginAction } from "@/lib/actions/auth"

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const res = await loginAction({
          email: String(credentials.email),
          password: String(credentials.password),
        })
        return {
          ...res.user,
          accessToken: res.accessToken,
          refreshToken: res.refreshToken,
        }
      },
    }),
  ],
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.image = user.image
        token.emailVerified = user.emailVerified
        token.createdAt = user.createdAt
        token.updatedAt = user.updatedAt
        token.accessToken = user.accessToken
        token.refreshToken = user.refreshToken
      }
      return token
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = typeof token.id === "string" ? token.id : ""
        session.user.name = typeof token.name === "string" ? token.name : ""
        session.user.email = typeof token.email === "string" ? token.email : ""
        session.user.image =
          typeof token.image === "string" || token.image === null
            ? token.image
            : null
        ;(session.user as { emailVerified: boolean }).emailVerified =
          typeof token.emailVerified === "boolean" ? token.emailVerified : false
        session.user.createdAt =
          typeof token.createdAt === "string" ? token.createdAt : ""
        session.user.updatedAt =
          typeof token.updatedAt === "string" ? token.updatedAt : ""
        session.accessToken =
          typeof token.accessToken === "string" ? token.accessToken : undefined
        session.refreshToken =
          typeof token.refreshToken === "string"
            ? token.refreshToken
            : undefined
      }
      return session
    },
  },
})