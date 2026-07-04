import Link from "next/link"
import { ChefHat, Shield, LogOut, LogIn, UserPlus } from "lucide-react"
import { getCurrentUser } from "@/lib/auth"
import { logoutAction } from "@/app/actions"

export async function Navbar() {
  const user = await getCurrentUser()

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-card/90 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <ChefHat className="size-7" />
          <span className="text-xl font-bold">مطبخ العالم</span>
        </Link>

        <div className="flex items-center gap-2 text-sm">
          {user ? (
            <>
              {user.isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <Shield className="size-4" />
                  <span className="hidden sm:inline">لوحة التحكم</span>
                </Link>
              )}
              <span className="hidden rounded-md bg-secondary px-3 py-2 font-medium text-secondary-foreground sm:inline">
                مرحباً، {user.username}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-secondary"
                >
                  <LogOut className="size-4" />
                  <span className="hidden sm:inline">خروج</span>
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="flex items-center gap-1.5 rounded-md px-3 py-2 font-medium text-foreground transition-colors hover:bg-secondary"
              >
                <LogIn className="size-4" />
                دخول
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 font-medium text-primary-foreground transition-colors hover:opacity-90"
              >
                <UserPlus className="size-4" />
                حساب جديد
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
