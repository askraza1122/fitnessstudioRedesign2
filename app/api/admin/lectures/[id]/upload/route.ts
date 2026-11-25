import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-api";
import { bunnyConfig, uploadToBunnyStorage } from "@/lib/bunny";

// Admin: upload a video file for a lecture -> Bunny Storage -> CDN URL saved
// on the lecture. Files are NOT stored on the app server.
const MAX_BYTES = 1024 * 1024 * 1024; // 1 GB

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const gate = await requireAdmin();
  if ("response" in gate) return gate.response;
  const { id } = await params;

  const { configured } = bunnyConfig();
  if (!configured) {
    return NextResponse.json(
      {
        error:
          "Bunny Storage is not configured. Set BUNNY_STORAGE_PASSWORD (and BUNNY_STORAGE_ZONE) in Coolify env to enable uploads.",
      },
      { status: 503 }
    );
  }

  const lecture = await prisma.lecture.findUnique({ where: { id } });
  if (!lecture) {
    return NextResponse.json({ error: "Lecture not found." }, { status: 404 });
  }

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return NextResponse.json({ error: "Expected a multipart form upload." }, { status: 400 });
  }
  const file = form.get("file");
  if (!file || typeof file === "string" || typeof (file as File).arrayBuffer !== "function") {
    return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
  }
  const f = file as File;
  if (f.size === 0) {
    return NextResponse.json({ error: "Uploaded file is empty." }, { status: 400 });
  }
  if (f.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "File is larger than the 1 GB upload limit." },
      { status: 413 }
    );
  }
  if (!/^(video\/|application\/octet-stream)/.test(f.type) && !/\.(mp4|mov|webm|mkv)$/i.test(f.name)) {
    return NextResponse.json(
      { error: "Please upload a video file (mp4, mov, webm)." },
      { status: 400 }
    );
  }

  try {
    const bytes = Buffer.from(await f.arrayBuffer());
    const videoUrl = await uploadToBunnyStorage({
      fileName: f.name,
      bytes,
      contentType: f.type || "video/mp4",
    });
    const updated = await prisma.lecture.update({
      where: { id },
      data: { videoUrl },
    });
    return NextResponse.json({ lecture: updated, videoUrl });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Upload failed." },
      { status: 502 }
    );
  }
}
