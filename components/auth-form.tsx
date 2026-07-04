"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { loginAction, registerAction } from "@/app/actions"

type AuthState = { error?: string } | null

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus()
  return (
    <button
      type="submit"
      disabled={pending}
      className="mt-2 w-full rounded-lg bg-primary px-4 py-2.5 font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-60"
    >
      {pending ? "جارٍ المعالجة..." : label}
    </button>
  )
}

export function AuthForm({ mode }: { mode: "login" | "register" }) {
  const action = mode === "login" ? loginAction : registerAction
  const [state, formAction] = useActionState<AuthState, FormData>(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="username" className="text-sm font-medium text-foreground">
          اسم المستخدم
        </label>
        <input
          id="username"
          name="username"
          type="text"
          required
          autoComplete="username"
          className="rounded-lg border border-input bg-background p-2.5 text-foreground outline-none ring-ring/50 transition focus:ring-2"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-sm font-medium text-foreground">
          كلمة المرور
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete={mode === "login" ? "current-password" : "new-password"}
          className="rounded-lg border border-input bg-background p-2.5 text-foreground outline-none ring-ring/50 transition focus:ring-2"
        />
      </div>

      {state?.error && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{state.error}</p>
      )}

      <SubmitButton label={mode === "login" ? "دخول" : "إنشاء الحساب"} />
    </form>
  )
}
