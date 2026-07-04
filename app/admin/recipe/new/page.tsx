import Link from "next/link"
import { redirect } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { requireAdmin } from "@/lib/auth"
import { addRecipeAction } from "@/app/actions"

export const dynamic = "force-dynamic"

const inputClass =
  "rounded-lg border border-input bg-background p-2.5 text-foreground outline-none ring-ring/50 transition focus:ring-2"

export default async function NewRecipePage() {
  const admin = await requireAdmin()
  if (!admin) redirect("/")

  const countries = await prisma.country.findMany({ orderBy: { name: "asc" } })

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/admin" className="transition-colors hover:text-primary">
          لوحة التحكم
        </Link>
        <ChevronRight className="size-4 rotate-180" />
        <span className="font-medium text-foreground">وصفة جديدة</span>
      </nav>

      <h1 className="mb-6 text-3xl font-bold text-foreground">إضافة وصفة جديدة</h1>

      {countries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center text-muted-foreground">
          يجب إضافة دولة واحدة على الأقل من{" "}
          <Link href="/admin" className="font-bold text-primary underline">
            لوحة التحكم
          </Link>{" "}
          قبل إضافة وصفة.
        </div>
      ) : (
        <form action={addRecipeAction} className="flex flex-col gap-5 rounded-2xl border border-border bg-card p-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="countryId" className="text-sm font-medium text-foreground">
              الدولة
            </label>
            <select id="countryId" name="countryId" required className={inputClass}>
              {countries.map((country) => (
                <option key={country.id} value={country.id}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="title" className="text-sm font-medium text-foreground">
              عنوان الوصفة
            </label>
            <input id="title" name="title" type="text" required className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="image" className="text-sm font-medium text-foreground">
              رابط الصورة
            </label>
            <input id="image" name="image" type="url" placeholder="https://..." className={inputClass} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="description" className="text-sm font-medium text-foreground">
              وصف مختصر
            </label>
            <textarea id="description" name="description" rows={2} className={`resize-none ${inputClass}`} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="ingredients" className="text-sm font-medium text-foreground">
              المكونات (كل مكوّن في سطر)
            </label>
            <textarea id="ingredients" name="ingredients" rows={5} required className={`resize-none ${inputClass}`} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="steps" className="text-sm font-medium text-foreground">
              خطوات التحضير (كل خطوة في سطر)
            </label>
            <textarea id="steps" name="steps" rows={6} required className={`resize-none ${inputClass}`} />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="time" className="text-sm font-medium text-foreground">
                مدة التحضير (بالدقائق)
              </label>
              <input id="time" name="time" type="number" min={1} required className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="difficulty" className="text-sm font-medium text-foreground">
                مستوى الصعوبة
              </label>
              <select id="difficulty" name="difficulty" required className={inputClass}>
                <option value="سهل">سهل</option>
                <option value="متوسط">متوسط</option>
                <option value="صعب">صعب</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="mt-2 rounded-lg bg-primary px-4 py-3 font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            حفظ الوصفة
          </button>
        </form>
      )}
    </main>
  )
}
