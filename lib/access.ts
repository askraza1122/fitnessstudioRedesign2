import { prisma } from "@/lib/prisma";
import type { Course, Enrollment, Lecture } from "@prisma/client";

export type AccessResult =
  | { allowed: true }
  | { allowed: false; reason: "login" | "locked" };

export async function getEnrollment(
  userId: string,
  courseId: string
): Promise<Enrollment | null> {
  return prisma.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId } },
  });
}

/**
 * Access rules (Phase 2):
 * - Admin bypasses all locks.
 * - Lectures 1-3 (isFree) are playable by any logged-in user.
 * - Lectures 4+ need an `unlocked` enrollment for that course.
 */
export function canAccessLecture(args: {
  role: string;
  lecture: Pick<Lecture, "isFree">;
  enrollment: Enrollment | null;
}): AccessResult {
  if (args.role === "admin") return { allowed: true };
  if (args.lecture.isFree) return { allowed: true };
  if (args.enrollment?.status === "unlocked") return { allowed: true };
  return { allowed: false, reason: "locked" };
}

export async function getCourseWithLectures(slug: string): Promise<
  (Course & { lectures: Lecture[] }) | null
> {
  return prisma.course.findUnique({
    where: { slug },
    include: { lectures: { orderBy: { order: "asc" } } },
  });
}

export const ENROLLMENT_STATUSES = [
  "requested",
  "paid",
  "unlocked",
  "rejected",
] as const;

export const ORDER_STATUSES = [
  "new",
  "confirmed",
  "delivered",
  "cancelled",
] as const;

export const TIER_LABELS: Record<string, string> = {
  one_to_one: "One-to-One",
  group: "Group of 5",
  home: "Home-Based Trainer",
  flat: "Flat price",
};
