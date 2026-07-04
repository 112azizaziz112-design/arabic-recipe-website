import { PrismaClient } from '@prisma/client'
import Link from 'next/link'
const prisma = new PrismaClient()

export const dynamic = "force-dynamic"

export default async function Home({ searchParams }: { searchParams: { category?: string, countryId?: string } }) {
  
  const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });
  const recipes = await prisma.recipe.findMany({
    where: {
      category: searchParams.category || undefined,
      countryId: searchParams.countryId || undefined,
    },
    include: { country: true },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <main className="mx-auto max-w-7xl px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">وصفات أم سعيد</h1>
        <Link href="/add-recipe" className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-bold">
          + إضافة وصفة
        </Link>
      </div>

      <form className="flex flex-wrap gap-4 mb-8 bg-card p-4 rounded-2xl border">
        <select name="category" defaultValue={searchParams.category || ""} className="border p-2 rounded-lg bg-background">
          <option value="">كل التصنيفات</option>
          <option value="أطباق رئيسية">أطباق رئيسية</option>
          <option value="مقبلات">مقبلات</option>
          <option value="حلويات">حلويات</option>
          <option value="معجنات">معجنات</option>
          <option value="سلطات">سلطات</option>
          <option value="شوربات">شوربات</option>
          <option value="أكلات شعبية">أكلات شعبية</option>
          <option value="أكلات رمضانية">أكلات رمضانية</option>
        </select>

        <select name="countryId" defaultValue={searchParams.countryId || ""} className="border p-2 rounded-lg bg-background">
          <option value="">كل الدول</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <button type="submit" className="bg-primary text-primary-foreground px-6 rounded-lg font-bold">بحث</button>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {recipes.length === 0 ? <p className="text-muted-foreground col-span-3 text-center">لا توجد وصفات تطابق البحث</p> : recipes.map((recipe) => (
          <Link href={`/recipe/${recipe.id}`} key={recipe.id} className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card">
            <img src={recipe.image || "/placeholder.svg"} alt={recipe.title} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h2 className="font-bold text-xl mb-2">{recipe.title}</h2>
              <div className="flex gap-2 text-xs">
                {recipe.category && <span className="bg-secondary px-2 py-1 rounded">{recipe.category}</span>}
                <span className="bg-secondary px-2 py-1 rounded">{recipe.country?.name}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  )
}