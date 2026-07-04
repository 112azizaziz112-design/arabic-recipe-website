import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  // Admin user: username "admin", password "admin123"
  const password = await bcrypt.hash("admin123", 10)
  await prisma.user.upsert({
    where: { username: "admin" },
    update: { isAdmin: true },
    create: { username: "admin", password, isAdmin: true },
  })

  const egypt = await prisma.country.upsert({
    where: { name: "مصر" },
    update: {},
    create: { name: "مصر" },
  })

  const levant = await prisma.country.upsert({
    where: { name: "الشام" },
    update: {},
    create: { name: "الشام" },
  })

  const existing = await prisma.recipe.count()
  if (existing === 0) {
    await prisma.recipe.create({
      data: {
        title: "كشري مصري",
        image: "/egyptian-koshari.jpg",
        description: "طبق مصري شعبي مكوّن من الأرز والعدس والمكرونة مع صلصة الطماطم.",
        ingredients: "كوب أرز\nكوب عدس بني\nكوب مكرونة\nبصل مقلي\nصلصة طماطم\nحمص مسلوق",
        steps: "اسلق العدس حتى ينضج\nاطبخ الأرز مع العدس\nاسلق المكرونة\nحضّر صلصة الطماطم\nقدّم الطبق مع البصل المقلي",
        time: 45,
        difficulty: "متوسط",
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
        countryId: levant.id,
      },
    })
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
