"use client"

import { useRef } from "react"
import { useFormStatus } from "react-dom"
import { Send } from "lucide-react"
import { addCommentAction } from "@/app/actions"

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="flex items-center gap-2 self-start rounded-lg bg-primary px-5 py-2.5 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
    >
      <Send className="size-4" />
      {pending ? "جارٍ الإرسال..." : "إضافة تعليق"}
    </button>
  )
}

export function CommentForm({ recipeId }: { recipeId: string }) {
  const formRef = useRef<HTMLFormElement>(null)

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await addCommentAction(formData)
        formRef.current?.reset()
      }}
      className="flex flex-col gap-3"
    >
      <input type="hidden" name="recipeId" value={recipeId} />
      <textarea
        name="text"
        required
        rows={3}
        placeholder="شاركنا رأيك في الوصفة..."
        className="w-full resize-none rounded-lg border border-input bg-card p-3 text-foreground outline-none ring-ring/50 transition focus:ring-2"
      />
      <SubmitButton />
    </form>
  )
}
