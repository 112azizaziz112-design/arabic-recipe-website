// app/add-recipe/page.tsx
import { PrismaClient } from '@prisma/client'
import { redirect } from 'next/navigation'
const prisma = new PrismaClient()

export default async function AddRecipePage() {
  const countries = await prisma.country.findMany({ orderBy: { name: 'asc' } });

  async function createRecipe(formData: FormData) {
    'use server'
    await prisma.recipe.create({
      data: {
        title: formData.get('title') as string,
        image: formData.get('image') as string,
        ingredients: formData.get('ingredients') as string,
        steps: formData.get('steps') as string,
        time: parseInt(formData.get('time') as string),
        difficulty: formData.get('difficulty') as string,
        description: formData.get('description') as string,
        category: formData.get('category') as string,
        countryId: formData.get('countryId') as string,
      }
    })
    redirect('/')
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">إضافة وصفة جديدة</h1>
      <form action={createRecipe} className="space-y-4">
        <input name="title" placeholder="اسم الوصفة" required className="border p-2 w-full rounded" />
        <input name="image" placeholder="رابط الصورة" required className="border p-2 w-full rounded" />
        
        <select name="category" required className="border p-2 w-full rounded">
          <option value="">اختاري التصنيف</option>
          <option value="أطباق رئيسية">أطباق رئيسية</option>
          <option value="مقبلات">مقبلات</option>
          <option value="سلطات">سلطات</option>
          <option value="شوربات">شوربات</option>
          <option value="معجنات">معجنات</option>
          <option value="حلويات">حلويات</option>
          <option value="مشروبات ساخنة">مشروبات ساخنة</option>
          <option value="مشروبات باردة">مشروبات باردة</option>
          <option value="عصائر">عصائر</option>
          <option value="أكلات شعبية">أكلات شعبية</option>
          <option value="مأكولات بحرية">مأكولات بحرية</option>
          <option value="وجبات صحية">وجبات صحية</option>
          <option value="إفطار">إفطار</option>
          <option value="أكلات رمضانية">أكلات رمضانية</option>
          <option value="أكلات العيد">أكلات العيد</option>
          <option value="مخللات">مخللات</option>
          <option value="صوصات">صوصات</option>
        </select>

        <select name="countryId" required className="border p-2 w-full rounded">
          <option value="">اختاري الدولة</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <input name="time" type="number" placeholder="الوقت بالدقائق" required className="border p-2 w-full rounded" />
        <select name="difficulty" required className="border p-2 w-full rounded">
          <option value="">اختاري الصعوبة</option>
          <option value="سهل">سهل</option>
          <option value="متوسط">متوسط</option>
          <option value="صعب">صعب</option>
        </select>
        
        <textarea name="description" placeholder="وصف قصير" required className="border p-2 w-full rounded" />
        <textarea name="ingredients" placeholder="المكونات - كل مكون في سطر" required className="border p-2 w-full rounded h-32" />
        <textarea name="steps" placeholder="طريقة التحضير - كل خطوة في سطر" required className="border p-2 w-full rounded h-32" />
        
        <button type="submit" className="bg-green-600 text-white p-3 rounded w-full font-bold">
          حفظ الوصفة
        </button>
      </form>
    </div>
  )
}