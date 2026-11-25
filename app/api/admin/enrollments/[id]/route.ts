import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { ENROLLMENT_STATUSES } from "@/lib/access";

/** Admin: change an enrollment's status (requested/paid/unlocked/rejected). */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { session } = gate;
  const { id } = await params;

  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const status = String(body.status ?? "");
  if (!(ENROLLMENT_STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json(
      { error: `status must be one of: ${ENROLLMENT_STATUSES.join(", ")}` },
      { status: 400 }
    );
  }

  const existing = await prisma.enrollment.findUnique({ where: { id } });
  if (!existing) {
    return NextResponse.json({ error: "Enrollment not found." }, { status: 404 });
  }

  const updated = await prisma.enrollment.update({
    where: { id },
    data: { status, decidedBy: session.user!.id, decidedAt: new Date() },
  });
  return NextResponse.json({ enrollment: updated });
}
