import Link from "next/link"
import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { AuthForm } from "@/components/auth-form"

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) redirect("/")

  return (
    <main className="mx-auto flex min-h-[calc(100vh-64px)] max-w-md flex-col justify-center px-4 py-12">
      <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-card-foreground">تسجيل الدخول</h1>
        <p className="mb-6 text-sm text-muted-foreground">مرحباً بعودتك! أدخل بياناتك للمتابعة.</p>
        <AuthForm mode="login" />
        <p className="mt-5 text-center text-sm text-muted-foreground">
          ليس لديك حساب؟{" "}
          <Link href="/register" className="font-bold text-primary hover:underline">
            أنشئ حساباً
          </Link>
        </p>
      </div>
    </main>
  )
}
