import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronRight } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { RecipeCard } from "@/components/recipe-card"

export const dynamic = "force-dynamic"

export default async function CountryPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const countryName = decodeURIComponent(name)

  const country = await prisma.country.findUnique({
    where: { name: countryName },
    include: { recipes: { orderBy: { createdAt: "desc" } } },
  })

  if (!country) notFound()

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <nav className="mb-6 flex items-center gap-1 text-sm text-muted-foreground">
        <Link href="/" className="transition-colors hover:text-primary">
          الرئيسية
        </Link>
        <ChevronRight className="size-4 rotate-180" />
        <span className="font-medium text-foreground">{country.name}</span>
      </nav>

      <h1 className="mb-8 text-3xl font-bold text-foreground">وصفات {country.name}</h1>

      {country.recipes.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center text-muted-foreground">
          لا توجد وصفات لهذه الدولة بعد.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {country.recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              title={recipe.title}
              image={recipe.image}
              time={recipe.time}
              difficulty={recipe.difficulty}
              description={recipe.description}
            />
          ))}
        </div>
      )}
    </main>
  )
}
