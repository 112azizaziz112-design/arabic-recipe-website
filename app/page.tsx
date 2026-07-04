import Link from "next/link"
import { UtensilsCrossed, ArrowLeft } from "lucide-react"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const countries = await prisma.country.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { recipes: true } } },
  })

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <section className="mb-10 rounded-3xl bg-primary px-6 py-14 text-center text-primary-foreground">
        <h1 className="mb-3 text-3xl font-bold text-balance sm:text-4xl">مطبخ العالم</h1>
        <p className="mx-auto max-w-xl text-pretty leading-relaxed opacity-90">
          اكتشف ألذ الوصفات التقليدية من مختلف الدول. اختر الدولة وابدأ رحلتك في عالم النكهات.
        </p>
      </section>

      <div className="mb-6 flex items-center gap-2">
        <UtensilsCrossed className="size-6 text-primary" />
        <h2 className="text-2xl font-bold text-foreground">تصفّح حسب الدولة</h2>
      </div>

      {countries.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          لا توجد دول مضافة بعد. سيتم إضافة الوصفات قريباً.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => (
            <Link
              key={country.id}
              href={`/country/${encodeURIComponent(country.name)}`}
              className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-primary hover:shadow-md"
            >
              <div>
                <h3 className="text-xl font-bold text-card-foreground">{country.name}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{country._count.recipes} وصفة</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowLeft className="size-5" />
              </span>
            </Link>
          ))}
        </div>
      )}
    </main>
  )
}
