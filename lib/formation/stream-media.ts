import { createReadStream, existsSync, statSync } from "fs";
import { Readable } from "stream";
import { NextResponse } from "next/server";
import { getFormationMediaPublicUrl } from "@/lib/formation/media";

function parseRange(header: string | null, size: number) {
  if (!header) return null;
  const match = header.match(/bytes=(\d*)-(\d*)/);
  if (!match) return null;
  const start = match[1] ? Number(match[1]) : 0;
  const end = match[2] ? Number(match[2]) : size - 1;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
    return null;
  }
  return { start, end: Math.min(end, size - 1) };
}

export async function streamFormationFile({
  request,
  localPath,
  kind,
  filename,
  contentType,
}: {
  request: Request;
  localPath: string;
  kind: "audio" | "video";
  filename: string;
  contentType: string;
}) {
  const rangeHeader = request.headers.get("range");

  if (existsSync(localPath)) {
    const stat = statSync(localPath);
    const range = parseRange(rangeHeader, stat.size);
    if (range) {
      const stream = createReadStream(localPath, { start: range.start, end: range.end });
      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          "Content-Type": contentType,
          "Content-Length": String(range.end - range.start + 1),
          "Content-Range": `bytes ${range.start}-${range.end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Cache-Control": "private, no-store",
        },
      });
    }

    const stream = createReadStream(localPath);
    return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": String(stat.size),
        "Accept-Ranges": "bytes",
        "Cache-Control": "private, no-store",
      },
    });
  }

  const remote = getFormationMediaPublicUrl(kind, filename);
  if (!remote) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const headers: HeadersInit = {};
  if (rangeHeader) headers.Range = rangeHeader;
  const upstream = await fetch(remote, { headers, cache: "no-store" });
  if (!upstream.ok && upstream.status !== 206) {
    return NextResponse.json({ error: "Fichier introuvable" }, { status: 404 });
  }

  const out = new Headers();
  out.set("Content-Type", contentType);
  out.set("Cache-Control", "private, no-store");
  out.set("Accept-Ranges", "bytes");
  const length = upstream.headers.get("content-length");
  if (length) out.set("Content-Length", length);
  const contentRange = upstream.headers.get("content-range");
  if (contentRange) out.set("Content-Range", contentRange);

  return new NextResponse(upstream.body, {
    status: upstream.status,
    headers: out,
  });
}
