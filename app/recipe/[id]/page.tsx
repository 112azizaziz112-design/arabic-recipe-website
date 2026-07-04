import Link from "next/link"
import { notFound } from "next/navigation"
import { Clock, ChefHat, MapPin, MessageCircle, Lock } from "lucide-react"
import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/lib/auth"
import { FavoriteButton } from "@/components/favorite-button"
import { CommentForm } from "@/components/comment-form"

export const dynamic = "force-dynamic"

function toList(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

export default async function RecipePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const recipe = await prisma.recipe.findUnique({
    where: { id },
    include: {
      country: true,
      comments: {
        orderBy: { createdAt: "desc" },
        include: { user: { select: { username: true } } },
      },
    },
  })

  if (!recipe) notFound()

  const user = await getCurrentUser()
  let isFavorite = false
  if (user) {
    const fav = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId: user.id, recipeId: recipe.id } },
    })
    isFavorite = Boolean(fav)
  }

  const ingredients = toList(recipe.ingredients)
  const steps = toList(recipe.steps)

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm">
        <div className="aspect-[16/9] w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="size-full object-cover" />
        </div>

        <div className="p-6 sm:p-8">
          <Link
            href={`/country/${encodeURIComponent(recipe.country.name)}`}
            className="mb-3 inline-flex items-center gap-1 rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent"
          >
            <MapPin className="size-4" />
            {recipe.country.name}
          </Link>

          <h1 className="mb-3 text-3xl font-bold text-card-foreground text-balance">{recipe.title}</h1>
          <p className="mb-5 leading-relaxed text-muted-foreground text-pretty">{recipe.description}</p>

          <div className="mb-6 flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground">
              <Clock className="size-5 text-primary" />
              {recipe.time} دقيقة
            </span>
            <span className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground">
              <ChefHat className="size-5 text-primary" />
              {recipe.difficulty}
            </span>
            {recipe.category && (
  <span className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-medium text-secondary-foreground">
    {recipe.category}
  </span>
)}
          </div>

          {user && <FavoriteButton recipeId={recipe.id} isFavorite={isFavorite} />}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold text-card-foreground">المكونات</h2>
          <ul className="flex flex-col gap-2">
            {ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-foreground">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-border bg-card p-6">
          <h2 className="mb-4 text-xl font-bold text-card-foreground">طريقة التحضير</h2>
          <ol className="flex flex-col gap-4">
            {steps.map((step, i) => (
              <li key={i} className="flex items-start gap-3 text-foreground">
                <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {i + 1}
                </span>
                <span className="pt-0.5 leading-relaxed">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-6">
        <div className="mb-5 flex items-center gap-2">
          <MessageCircle className="size-6 text-primary" />
          <h2 className="text-xl font-bold text-card-foreground">التعليقات ({recipe.comments.length})</h2>
        </div>

        {user ? (
          <div className="mb-6">
            <CommentForm recipeId={recipe.id} />
          </div>
        ) : (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-secondary p-4 text-sm text-secondary-foreground">
            <Lock className="size-4" />
            <span>
              يجب{" "}
              <Link href="/login" className="font-bold text-primary underline">
                تسجيل الدخول
              </Link>{" "}
              لإضافة تعليق أو حفظ الوصفة.
            </span>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {recipe.comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">لا توجد تعليقات بعد. كن أول من يعلّق!</p>
          ) : (
            recipe.comments.map((comment) => (
              <div key={comment.id} className="rounded-lg border border-border bg-background p-4">
                <div className="mb-1 flex items-center justify-between">
                  <span className="font-bold text-foreground">{comment.user.username}</span>
                  <span className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleDateString("ar-EG")}
                  </span>
                </div>
                <p className="leading-relaxed text-foreground">{comment.text}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </main>
  )
}
