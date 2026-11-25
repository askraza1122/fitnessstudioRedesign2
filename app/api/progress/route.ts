import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { canAccessLecture, getEnrollment } from "@/lib/access";

/** Mark a lecture complete for the logged-in student. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Please log in." }, { status: 401 });
  }

  let body: { lectureId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const lectureId = String(body.lectureId ?? "");
  if (!lectureId) {
    return NextResponse.json({ error: "lectureId is required." }, { status: 400 });
  }

  const lecture = await prisma.lecture.findUnique({
    where: { id: lectureId },
    include: { course: true },
  });
  if (!lecture) {
    return NextResponse.json({ error: "Lecture not found." }, { status: 404 });
  }

  const enrollment = await getEnrollment(session.user.id, lecture.courseId);
  const access = canAccessLecture({
    role: session.user.role,
    lecture,
    enrollment,
  });
  if (!access.allowed) {
    return NextResponse.json(
      { error: "This lecture is locked. Enroll to unlock it." },
      { status: 403 }
    );
  }

  const progress = await prisma.lectureProgress.upsert({
    where: { userId_lectureId: { userId: session.user.id, lectureId } },
    update: { completedAt: new Date() },
    create: { userId: session.user.id, lectureId },
  });
  return NextResponse.json({ progress });
}
