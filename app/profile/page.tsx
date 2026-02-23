import { redirect } from "next/navigation"
import { auth } from "@/auth"
import { ProfileView } from "./ProfileView"

export default async function ProfilePage() {
  const session = await auth()
  if (!session) redirect("/login")
  return <ProfileView session={session} />
}
