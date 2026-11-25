// Seed script — creates the admin account + 6 courses x 8 lecture slots.
// Run:  npx tsx prisma/seed.ts        (uses DATABASE_URL from .env)
//   or: npx prisma db seed
//
// Admin credentials come ONLY from env. If ADMIN_EMAIL / ADMIN_PASSWORD are
// not set, the script REFUSES to create an admin and prints what to set.
// Never hardcode a password here.
//
// Lecture content: no real lecture videos exist yet, so each course gets 8
// generic slots ("Lecture 1" ... "Lecture 8", 2 per week over 4 weeks) with
// NO video URL. Lectures 1-3 are free; 4-8 are locked until an admin unlocks
// the student's enrollment. The admin attaches real videos from /admin.

import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { PROGRAMS, COURSE_DURATION } from "../lib/data";

const prisma = new PrismaClient();

const LECTURES_PER_COURSE = 8;
const FREE_LECTURES = 3;

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    console.error(
      "\nSeed REFUSED to create an admin account: ADMIN_EMAIL and/or ADMIN_PASSWORD are not set.\n" +
        "Set them in your environment (Coolify env vars in production, .env locally) and re-run:\n" +
        "  ADMIN_EMAIL=admin@fitnessstudiopk.com\n" +
        "  ADMIN_PASSWORD=<a strong password — never commit it>\n" +
        "Then: npx tsx prisma/seed.ts\n"
    );
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(adminPassword, 10);
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { name: "Fitness Studio Admin", role: "admin", passwordHash },
    create: {
      name: "Fitness Studio Admin",
      email: adminEmail,
      passwordHash,
      role: "admin",
    },
  });
  console.log(`Admin upserted: ${admin.email} (role=admin)`);

  for (const program of PROGRAMS) {
    const course = await prisma.course.upsert({
      where: { slug: program.slug },
      update: {
        title: program.title,
        description: program.short,
        durationWeeks: parseInt(COURSE_DURATION, 10) || 4,
        image: program.image,
      },
      create: {
        slug: program.slug,
        title: program.title,
        description: program.short,
        durationWeeks: parseInt(COURSE_DURATION, 10) || 4,
        image: program.image,
      },
    });

    for (let n = 1; n <= LECTURES_PER_COURSE; n++) {
      await prisma.lecture.upsert({
        where: { courseId_order: { courseId: course.id, order: n } },
        update: { isFree: n <= FREE_LECTURES },
        create: {
          courseId: course.id,
          order: n,
          title: `Lecture ${n}`,
          description: null,
          videoUrl: null,
          isFree: n <= FREE_LECTURES,
        },
      });
    }
    console.log(
      `Course seeded: ${course.slug} — ${LECTURES_PER_COURSE} lectures (1-${FREE_LECTURES} free)`
    );
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
