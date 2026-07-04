import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-card-foreground">إنشاء حساب جديد</h1>
        <p className="mb-6 text-sm text-muted-foreground">انضم إلينا لحفظ وصفاتك المفضلة والتعليق عليها.</p>
        <AuthForm mode="register" />
        <p className="mt-5 text-center text-sm text-muted-foreground">
          لديك حساب بالفعل؟{" "}
          <Link href="/login" className="font-bold text-primary hover:underline">
            سجّل الدخول
          </Link>
        </p>
      </div>
    </main>
  )
}
