import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";

/** Returns the admin session, or a 401/403 JSON response to return early. */
export async function requireAdmin(): Promise<
  { session: Session } | { response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      response: NextResponse.json({ error: "Please log in." }, { status: 401 }),
    };
  }
  if (session.user.role !== "admin") {
    return {
      response: NextResponse.json({ error: "Admin only." }, { status: 403 }),
    };
  }
  return { session };
}
