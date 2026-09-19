import { NextRequest, NextResponse } from "next/server";

const DEFAULT_API = "https://wellnest-backend-d55g.vercel.app";

function apiBase() {
  return (
    process.env.API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    DEFAULT_API
  ).replace(/\/$/, "");
}

type RouteContext = {
  params: Promise<{ path: string[] }>;
};

async function proxy(req: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const targetUrl = `${apiBase()}/${path.join("/")}${req.nextUrl.search}`;
  const method = req.method;
  const hasBody = method !== "GET" && method !== "HEAD";

  const headers = new Headers();
  // Forward auth reliably (some runtimes normalize header names).
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");
  if (authHeader) headers.set("authorization", authHeader);
  for (const key of ["content-type", "accept"]) {
    const value = req.headers.get(key);
    if (value) headers.set(key, value);
  }

  let upstream: Response;
  try {
    upstream = await fetch(targetUrl, {
      method,
      headers,
      body: hasBody ? await req.arrayBuffer() : undefined,
      // Never cache proxied CMS content — admin edits must show immediately on /ebooks.
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      {
        msg: "Backend inaccessible. Vérifiez NEXT_PUBLIC_API_URL sur Vercel.",
      },
      { status: 502 }
    );
  }

  const responseHeaders = new Headers();
  const contentType = upstream.headers.get("content-type");
  if (contentType) responseHeaders.set("content-type", contentType);
  responseHeaders.set("Cache-Control", "no-store");

  return new NextResponse(await upstream.arrayBuffer(), {
    status: upstream.status,
    headers: responseHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
