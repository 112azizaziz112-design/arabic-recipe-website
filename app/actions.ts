"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"
import { getCurrentUser, requireAdmin, SESSION_COOKIE } from "@/lib/auth"

// ---------- Auth ----------

export async function registerAction(_prev: unknown, formData: FormData) {
  const username = String(formData.get("username") || "").trim()
  const password = String(formData.get("password") || "")

  if (username.length < 3) {
    return { error: "اسم المستخدم يجب أن يكون 3 أحرف على الأقل" }
  }
  if (password.length < 4) {
    return { error: "كلمة المرور يجب أن تكون 4 أحرف على الأقل" }
  }

  const existing = await prisma.user.findUnique({ where: { username } })
  if (existing) {
    return { error: "اسم المستخدم مستخدم بالفعل" }
  }

  const hashed = await bcrypt.hash(password, 10)
  const user = await prisma.user.create({
    data: { username, password: hashed },
  })

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  redirect("/")
}

export async function loginAction(_prev: unknown, formData: FormData) {
  const username = String(formData.get("username") || "").trim()
  const password = String(formData.get("password") || "")

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user) {
    return { error: "اسم المستخدم أو كلمة المرور غير صحيحة" }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return { error: "اسم المستخدم أو كلمة المرور غير صحيحة" }
  }

  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, user.id, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  })

  redirect("/")
}

export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
  redirect("/")
}

// ---------- Countries (admin) ----------

export async function addCountryAction(formData: FormData) {
  const admin = await requireAdmin()
  if (!admin) redirect("/")

  const name = String(formData.get("name") || "").trim()
  if (!name) return

  await prisma.country.upsert({
    where: { name },
    update: {},
    create: { name },
  })

  revalidatePath("/admin")
  revalidatePath("/")
}

export async function deleteCountryAction(formData: FormData) {
  const admin = await requireAdmin()
  if (!admin) redirect("/")

  const id = String(formData.get("id") || "")
  if (!id) return

  await prisma.country.delete({ where: { id } })

  revalidatePath("/admin")
  revalidatePath("/")
}

// ---------- Recipes (admin) ----------

export async function addRecipeAction(formData: FormData) {
  const admin = await requireAdmin()
  if (!admin) redirect("/")

  const title = String(formData.get("title") || "").trim()
  const image = String(formData.get("image") || "").trim()
  const ingredients = String(formData.get("ingredients") || "").trim()
  const steps = String(formData.get("steps") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const time = Number.parseInt(String(formData.get("time") || "0"), 10) || 0
  const difficulty = String(formData.get("difficulty") || "سهل")
  const countryId = String(formData.get("countryId") || "")

  if (!title || !countryId) return

  await prisma.recipe.create({
    data: {
      title,
      image: image || "/delicious-dish.png",
      ingredients,
      steps,
      description,
      time,
      difficulty,
      countryId,
    },
  })

  revalidatePath("/admin")
  revalidatePath("/")
  redirect("/admin")
}

export async function deleteRecipeAction(formData: FormData) {
  const admin = await requireAdmin()
  if (!admin) redirect("/")

  const id = String(formData.get("id") || "")
  if (!id) return

  await prisma.recipe.delete({ where: { id } })

  revalidatePath("/admin")
  revalidatePath("/")
}

// ---------- Comments ----------

export async function addCommentAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const text = String(formData.get("text") || "").trim()
  const recipeId = String(formData.get("recipeId") || "")
  if (!text || !recipeId) return

  await prisma.comment.create({
    data: { text, recipeId, userId: user.id },
  })

  revalidatePath(`/recipe/${recipeId}`)
}

// ---------- Favorites ----------

export async function toggleFavoriteAction(formData: FormData) {
  const user = await getCurrentUser()
  if (!user) redirect("/login")

  const recipeId = String(formData.get("recipeId") || "")
  if (!recipeId) return

  const existing = await prisma.favorite.findUnique({
    where: { userId_recipeId: { userId: user.id, recipeId } },
  })

  if (existing) {
    await prisma.favorite.delete({ where: { id: existing.id } })
  } else {
    await prisma.favorite.create({ data: { userId: user.id, recipeId } })
  }

  revalidatePath(`/recipe/${recipeId}`)
}
