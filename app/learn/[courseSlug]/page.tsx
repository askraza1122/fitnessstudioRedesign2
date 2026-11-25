import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLecture, getCourseWithLectures, getEnrollment } from "@/lib/access";
import { getProgram } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function LearnCoursePage({
  params,
}: {
  params: Promise<{ courseSlug: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/learn");

  const { courseSlug } = await params;
  const course = await getCourseWithLectures(courseSlug);
  if (!course) {
    // Course exists in PROGRAMS but has not been seeded into the DB yet.
    const program = getProgram(courseSlug);
    if (!program) notFound();
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-3xl font-extrabold text-neutral-900">{program.title}</h1>
        <p className="mt-3 text-neutral-600">
          This course is being set up in the learning portal. Please check back
          soon, or enroll via WhatsApp from the program page.
        </p>
        <Link
          href={`/programs/${courseSlug}`}
          className="mt-6 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
        >
          Go to the program page →
        </Link>
      </div>
    );
  }

  const enrollment = await getEnrollment(session.user.id, course.id);
  const completed = await prisma.lectureProgress.findMany({
    where: {
      userId: session.user.id,
      lecture: { courseId: course.id },
    },
    select: { lectureId: true },
  });
  const completedIds = new Set(completed.map((p) => p.lectureId));
  const isAdmin = session.user.role === "admin";

  return (
    <div className="mx-auto max-w-7xl px-4 py-14">
      <Link href="/dashboard" className="text-sm font-semibold text-red-700 hover:underline">
        ← My Courses
      </Link>
      <h1 className="mt-3 text-4xl font-extrabold text-neutral-900">{course.title}</h1>
      <p className="mt-2 max-w-3xl leading-relaxed text-neutral-600">
        {course.description}
      </p>
      <p className="mt-2 text-sm text-neutral-500">
        {course.durationWeeks} weeks · {course.lectures.length} lectures ·
        Lectures 1–3 are free
        {enrollment
          ? enrollment.status === "unlocked"
            ? " · You have full access"
            : ` · Enrollment: ${enrollment.status}`
          : " · Not enrolled yet"}
      </p>

      <div className="mt-8 space-y-3">
        {course.lectures.map((lecture) => {
          const access = canAccessLecture({
            role: session.user!.role,
            lecture,
            enrollment,
          });
          const done = completedIds.has(lecture.id);
          const row = (
            <>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-sm font-bold text-red-700">
                {done ? "✓" : lecture.order}
              </span>
              <span className="flex-1">
                <span className="block font-bold text-neutral-900">
                  {lecture.title}
                  {done && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-800">
                      Completed
                    </span>
                  )}
                </span>
                <span className="block text-sm text-neutral-500">
                  {lecture.isFree ? "Free lecture" : "Paid lecture"}
                  {lecture.videoUrl ? " · Video ready" : " · Video coming soon"}
                </span>
              </span>
              <span className="text-sm font-semibold text-neutral-500">
                {access.allowed ? (isAdmin ? "Admin" : "Watch →") : "🔒 Locked"}
              </span>
            </>
          );
          const cls =
            "flex items-center gap-4 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm";
          return access.allowed ? (
            <Link
              key={lecture.id}
              href={`/learn/${course.slug}/${lecture.order}`}
              className={`${cls} transition hover:border-red-300 hover:shadow-md`}
            >
              {row}
            </Link>
          ) : (
            <div key={lecture.id} className={`${cls} opacity-80`}>
              {row}
            </div>
          );
        })}
      </div>

      {(!enrollment || enrollment.status !== "unlocked") && (
        <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-6">
          <p className="font-bold text-neutral-900">
            {enrollment?.status === "requested"
              ? "Your enrollment request is pending — the studio will confirm your payment."
              : enrollment?.status === "paid"
                ? "Payment confirmed — the studio will unlock your full course shortly."
                : enrollment?.status === "rejected"
                  ? "Your previous enrollment request was not approved — you can request again from the program page."
                  : "Lectures 4–8 unlock after enrollment."}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">
            Request enrollment from the program page — choose your format and
            the studio will share payment details on WhatsApp. There is no
            online payment yet.
          </p>
          <Link
            href={`/programs/${course.slug}`}
            className="mt-4 inline-block rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
          >
            Request enrollment →
          </Link>
        </div>
      )}
    </div>
  );
}
