import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLecture, getEnrollment } from "@/lib/access";
import { getProgram } from "@/lib/data";
import LecturePlayer from "@/components/learn/LecturePlayer";

export const dynamic = "force-dynamic";

export default async function LecturePage({
  params,
}: {
  params: Promise<{ courseSlug: string; lectureOrder: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/learn");

  const { courseSlug, lectureOrder: orderRaw } = await params;
  const order = parseInt(orderRaw, 10);
  if (!Number.isFinite(order)) notFound();

  const course = await prisma.course.findUnique({
    where: { slug: courseSlug },
    include: { lectures: { orderBy: { order: "asc" } } },
  });
  if (!course) notFound();

  const lecture = course.lectures.find((l) => l.order === order);
  if (!lecture) notFound();

  const enrollment = await getEnrollment(session.user.id, course.id);
  const access = canAccessLecture({
    role: session.user.role,
    lecture,
    enrollment,
  });

  const progress = await prisma.lectureProgress.findUnique({
    where: {
      userId_lectureId: { userId: session.user.id, lectureId: lecture.id },
    },
  });

  const program = getProgram(courseSlug);

  return (
    <div className="mx-auto max-w-5xl px-4 py-14">
      <Link
        href={`/learn/${course.slug}`}
        className="text-sm font-semibold text-red-700 hover:underline"
      >
        ← {course.title} — all lectures
      </Link>

      <div className="mt-4">
        {!access.allowed ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-8 text-center">
            <p className="text-4xl">🔒</p>
            <h1 className="mt-3 text-2xl font-extrabold text-neutral-900">
              Lecture {lecture.order} is locked
            </h1>
            <p className="mx-auto mt-2 max-w-md leading-relaxed text-neutral-600">
              {lecture.title} unlocks after your enrollment is approved. Lectures
              1–3 are free — this one needs an unlocked enrollment.
            </p>
            <p className="mt-3 text-sm text-neutral-600">
              {enrollment?.status === "requested"
                ? "Your enrollment request is pending — the studio will confirm your payment."
                : enrollment?.status === "paid"
                  ? "Payment confirmed — the studio will unlock your course shortly."
                  : "Request enrollment from the program page and the studio will share payment details on WhatsApp."}
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                href={`/programs/${course.slug}`}
                className="rounded-full bg-red-700 px-6 py-3 font-semibold text-white hover:bg-red-800"
              >
                {enrollment ? "View program page" : "Request enrollment →"}
              </Link>
              <Link
                href={`/learn/${course.slug}`}
                className="rounded-full border border-neutral-300 px-6 py-3 font-semibold text-neutral-700 hover:border-red-700 hover:text-red-700"
              >
                Back to free lectures
              </Link>
            </div>
            {program && (
              <p className="mt-4 text-xs text-neutral-500">
                No online payment yet — enrollment is confirmed manually by the studio.
              </p>
            )}
          </div>
        ) : (
          <LecturePlayer
            lectureId={lecture.id}
            courseSlug={course.slug}
            lectureOrder={lecture.order}
            totalLectures={course.lectures.length}
            videoUrl={lecture.videoUrl}
            title={lecture.title}
            description={lecture.description}
            isCompleted={Boolean(progress)}
          />
        )}
      </div>
    </div>
  );
}
