import Link from "next/link"
import { redirect } from "next/navigation"
import { Plus, Trash2, Globe, BookOpen } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { addCountryAction, deleteCountryAction, deleteRecipeAction } from "@/app/actions"

export const dynamic = "force-dynamic"

export default async function AdminPage() {
  const admin = await requireAdmin()
  if (!admin) redirect("/")

  const [countries, recipes] = await Promise.all([
    prisma.country.findMany({
      orderBy: { name: "asc" },
      include: { _count: { select: { recipes: true } } },
    }),
    prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
      include: { country: true },
    }),
  ])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
        <Link
          href="/admin/recipe/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:opacity-90"
        >
          <Plus className="size-5" />
          إضافة وصفة جديدة
        </Link>
      </div>

      {/* Countries */}
      <section className="mb-10 rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="size-6 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground">الدول</h2>
        </div>

        <form action={addCountryAction} className="mb-5 flex flex-wrap gap-3">
          <input
            name="name"
            required
            placeholder="اسم الدولة (مثال: مصر)"
            className="min-w-52 flex-1 rounded-lg border border-input bg-background p-2.5 text-foreground outline-none ring-ring/50 transition focus:ring-2"
          />
          <button
            type="submit"
            className="rounded-lg bg-secondary px-4 py-2.5 font-medium text-secondary-foreground transition-colors hover:bg-accent"
          >
            إضافة دولة
          </button>
        </form>

        <div className="flex flex-wrap gap-2">
          {countries.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد دول مضافة.</p>
          ) : (
            countries.map((country) => (
              <div
                key={country.id}
                className="flex items-center gap-2 rounded-full border border-border bg-background py-1.5 pe-2 ps-4"
              >
                <span className="text-sm font-medium text-foreground">
                  {country.name} ({country._count.recipes})
                </span>
                <form action={deleteCountryAction}>
                  <input type="hidden" name="id" value={country.id} />
                  <button
                    type="submit"
                    aria-label={`حذف ${country.name}`}
                    className="flex size-6 items-center justify-center rounded-full text-destructive transition-colors hover:bg-destructive/10"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </form>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Recipes */}
      <section className="rounded-2xl border border-border bg-card p-6">
        <div className="mb-4 flex items-center gap-2">
          <BookOpen className="size-6 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground">الوصفات ({recipes.length})</h2>
        </div>

        {recipes.length === 0 ? (
          <p className="text-sm text-muted-foreground">لا توجد وصفات مضافة بعد.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-right text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground">
                  <th className="p-3 font-medium">العنوان</th>
                  <th className="p-3 font-medium">الدولة</th>
                  <th className="p-3 font-medium">المدة</th>
                  <th className="p-3 font-medium">الصعوبة</th>
                  <th className="p-3 font-medium">إجراء</th>
                </tr>
              </thead>
              <tbody>
                {recipes.map((recipe) => (
                  <tr key={recipe.id} className="border-b border-border last:border-0">
                    <td className="p-3 font-medium text-foreground">
                      <Link href={`/recipe/${recipe.id}`} className="hover:text-primary hover:underline">
                        {recipe.title}
                      </Link>
                    </td>
                    <td className="p-3 text-muted-foreground">{recipe.country.name}</td>
                    <td className="p-3 text-muted-foreground">{recipe.time} د</td>
                    <td className="p-3 text-muted-foreground">{recipe.difficulty}</td>
                    <td className="p-3">
                      <form action={deleteRecipeAction}>
                        <input type="hidden" name="id" value={recipe.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 rounded-md px-2 py-1 text-destructive transition-colors hover:bg-destructive/10"
                        >
                          <Trash2 className="size-4" />
                          حذف
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  )
}
