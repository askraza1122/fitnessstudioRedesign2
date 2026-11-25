// Bunny CDN / Bunny Storage helpers for lecture videos.
// Videos are NEVER stored on the app server's filesystem (they would not
// survive a Coolify redeploy). They live in Bunny Storage and are played
// from the Bunny CDN pull zone.
//
// Env:
//   BUNNY_STORAGE_ZONE     — storage zone name (default "FitnessStudio")
//   BUNNY_STORAGE_PASSWORD — storage zone password (required for uploads)
//   BUNNY_CDN_HOST         — pull-zone hostname (default "<zone>.b-cdn.net")

export function bunnyConfig() {
  const zone = process.env.BUNNY_STORAGE_ZONE || "FitnessStudio";
  const password = process.env.BUNNY_STORAGE_PASSWORD;
  const cdnHost =
    process.env.BUNNY_CDN_HOST || `${zone}.b-cdn.net`;
  return { zone, password, cdnHost, configured: Boolean(password) };
}

export function bunnyCdnUrl(path: string) {
  const { cdnHost } = bunnyConfig();
  return `https://${cdnHost}/${path.replace(/^\/+/, "")}`;
}

function sanitizeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80) || "video";
}

/**
 * Upload a file buffer to Bunny Storage. Returns the public CDN URL.
 * Throws on missing config or a non-2xx Bunny response.
 */
export async function uploadToBunnyStorage(args: {
  fileName: string;
  bytes: Buffer;
  contentType: string;
}): Promise<string> {
  const { zone, password } = bunnyConfig();
  if (!password) {
    throw new Error(
      "BUNNY_STORAGE_PASSWORD is not configured. Set it in Coolify env (with BUNNY_STORAGE_ZONE) to enable uploads."
    );
  }
  const storagePath = `lectures/${Date.now()}-${sanitizeFileName(args.fileName)}`;
  const res = await fetch(
    `https://storage.bunnycdn.com/${zone}/${storagePath}`,
    {
      method: "PUT",
      headers: {
        AccessKey: password,
        "Content-Type": args.contentType || "application/octet-stream",
      },
      body: args.bytes as unknown as BodyInit,
    }
  );
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Bunny Storage upload failed (${res.status}). ${text.slice(0, 200)}`
    );
  }
  return bunnyCdnUrl(storagePath);
}
