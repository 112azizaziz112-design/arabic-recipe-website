// prisma/seed.mjs
import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // 1. إنشاء يوزر الأدمن
  const password = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { isAdmin: true },
    create: { username: "admin", password, isAdmin: true },
  })
  console.log("Admin user created ✅")

  // 2. إضافة كل الدول العربية + دول إضافية
  const countries = [
    'المغرب', 'الجزائر', 'تونس', 'ليبيا', 'مصر', 'السودان', 'موريتانيا', 'السعودية', 
    'الإمارات', 'قطر', 'الكويت', 'البحرين', 'عمان', 'اليمن', 'الأردن', 'فلسطين', 
    'لبنان', 'سوريا', 'العراق', 'الصومال', 'جيبوتي', 'جزر القمر', 'الشام', 'تركيا', 
    'إيران', 'الهند', 'باكستان', 'أفغانستان', 'إندونيسيا', 'ماليزيا', 'الصين', 'اليابان', 'فرنسا'
  ]

  for (const name of countries) {
    await prisma.country.upsert({
      where: { name },
      update: {},
      create: { name },
    })
  }
  console.log(`Seeded ${countries.length} countries ✅`)

  // 3. إضافة وصفات تجريبية لو قاعدة البيانات فاضية
  const existing = await prisma.recipe.count()
  if (existing === 0) {
    const egypt = await prisma.country.findUnique({ where: { name: "مصر" } })
    const levant = await prisma.country.findUnique({ where: { name: "الشام" } })

    await prisma.recipe.create({
      data: {
        title: "كشري مصري",
        image: "/egyptian-koshari.jpg",
        description: "طبق مصري شعبي مكوّن من الأرز والعدس والمكرونة مع صلصة الطماطم.",
        ingredients: "كوب أرز\nكوب عدس بني\nكوب مكرونة\nبصل مقلي\nصلصة طماطم\nحمص مسلوق",
        steps: "اسلق العدس حتى ينضج\nاطبخ الأرز مع العدس\nاسلق المكرونة\nحضّر صلصة الطماطم\nقدّم الطبق مع البصل المقلي",
        time: 45,
        difficulty: "متوسط",
        category: "أطباق رئيسية",
        countryId: egypt.id,
      },
    })

    await prisma.recipe.create({
      data: {
        title: "تبولة",
        image: "/lebanese-tabbouleh-salad.jpg",
        description: "سلطة شامية منعشة بالبقدونس والبرغل والطماطم.",
        ingredients: "بقدونس مفروم\nبرغل ناعم\nطماطم\nبصل أخضر\nعصير ليمون\nزيت زيتون",
        steps: "انقع البرغل\nافرم البقدونس والطماطم\nاخلط المكونات\nأضف الليمون وزيت الزيتون\nقدّمها باردة",
        time: 20,
        difficulty: "سهل",
        category: "سلطات",
        countryId: levant.id,
      },
    })
    console.log("Added sample recipes ✅")
  }

  console.log("Seed complete. Admin login -> username: admin, password: admin123")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })