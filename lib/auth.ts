import { cookies } from "next/headers"
import { prisma } from "@/lib/prisma"

export const SESSION_COOKIE = "recipe_session"

export type SessionUser = {
  id: string
  username: string
  isAdmin: boolean
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies()
  const userId = cookieStore.get(SESSION_COOKIE)?.value
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, username: true, isAdmin: true },
  })

  return user ?? null
}

export async function requireAdmin(): Promise<SessionUser | null> {
  const user = await getCurrentUser()
  if (!user || !user.isAdmin) return null
  return user
}
