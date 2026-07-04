import Link from "next/link"
import { Clock, ChefHat } from "lucide-react"

type RecipeCardProps = {
  id: string
  title: string
  image: string
  time: number
  difficulty: string
  description: string
}

export function RecipeCard({ id, title, image, time, difficulty, description }: RecipeCardProps) {
  return (
    <Link
      href={`/recipe/${id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h3 className="text-lg font-bold text-card-foreground text-balance">{title}</h3>
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-2 flex items-center gap-4 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="size-4 text-primary" />
            {time} دقيقة
          </span>
          <span className="flex items-center gap-1">
            <ChefHat className="size-4 text-primary" />
            {difficulty}
          </span>
        </div>
      </div>
    </Link>
  )
}
