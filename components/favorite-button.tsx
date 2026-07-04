"use client"

import { Heart } from "lucide-react"
import { useFormStatus } from "react-dom"
import { toggleFavoriteAction } from "@/app/actions"

function SubmitButton({ isFavorite }: { isFavorite: boolean }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className={`flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 font-medium transition-colors disabled:opacity-60 ${
        isFavorite
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-card text-foreground hover:bg-secondary"
      }`}
    >
      <Heart className={`size-5 ${isFavorite ? "fill-current" : ""}`} />
      {isFavorite ? "محفوظة في المفضلة" : "حفظ الوصفة"}
    </button>
  )
}

export function FavoriteButton({ recipeId, isFavorite }: { recipeId: string; isFavorite: boolean }) {
  return (
    <form action={toggleFavoriteAction}>
      <input type="hidden" name="recipeId" value={recipeId} />
      <SubmitButton isFavorite={isFavorite} />
    </form>
  )
}
