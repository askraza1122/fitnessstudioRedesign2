import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";

/** Admin: edit a lecture's title / description / video URL / order. */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;

  let body: {
    title?: string;
    description?: string | null;
    videoUrl?: string | null;
    order?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const existing = await prisma.lecture.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Lecture not found." }, { status: 404 });
  }

  const data: {
    title?: string;
    description?: string | null;
    videoUrl?: string | null;
    order?: number;
  } = {};

  if (body.title !== undefined) {
    const title = String(body.title).trim();
    if (!title) {
      return NextResponse.json({ error: "Title cannot be empty." }, { status: 400 });
    }
    data.title = title;
  }
  if (body.description !== undefined) {
    const d = body.description === null ? null : String(body.description).trim();
    data.description = d || null;
  }
  if (body.videoUrl !== undefined) {
    const u = body.videoUrl === null ? null : String(body.videoUrl).trim();
    if (u && !/^https?:\/\//i.test(u)) {
      return NextResponse.json(
        { error: "Video URL must start with http:// or https://." },
        { status: 400 }
      );
    }
    data.videoUrl = u || null;
  }
  if (body.order !== undefined) {
    const order = Math.floor(Number(body.order));
    if (!Number.isFinite(order) || order < 1 || order > 99) {
      return NextResponse.json(
        { error: "Order must be a whole number between 1 and 99." },
        { status: 400 }
      );
    }
    data.order = order;
  }

  try {
    const updated = await prisma.lecture.update({ where: { id }, data });
    return NextResponse.json({ lecture: updated });
  } catch (e) {
    // Most likely the (courseId, order) unique constraint — two lectures
    // cannot share an order within a course.
    return NextResponse.json(
      { error: "Could not save: another lecture in this course already has that order number.", details: String(e).slice(0, 200) },
      { status: 409 }
    );
  }
}
