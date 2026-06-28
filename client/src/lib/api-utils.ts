import { type NextRequest } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const FORWARD_HEADERS = new Set([
  "accept",
  "accept-encoding",
  "accept-language",
  "authorization",
  "cache-control",
  "content-type",
  "cookie",
  "if-none-match",
  "if-modified-since",
  "origin",
  "referer",
  "user-agent",
  "x-csrf-token",
  "x-requested-with",
]);

const EXCLUDE_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "keep-alive",
]);

export async function callBackend(req: NextRequest, endpoint?: string) {
  const path = endpoint
    ? `/api/${endpoint.replace(/^\//, "")}`
    : req.nextUrl.pathname + req.nextUrl.search;

  const headers = new Headers();
  for (const [key, value] of req.headers) {
    if (FORWARD_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = await req.text();
  }

  const response = await fetch(`${BACKEND_URL}${path}`, init);

  const resHeaders = new Headers();
  for (const [key, value] of response.headers) {
    if (!EXCLUDE_RESPONSE_HEADERS.has(key.toLowerCase())) {
      resHeaders.set(key, value);
    }
  }

  if (response.status >= 300 && response.status < 400) {
    const location = resHeaders.get("location");
    if (location) {
      return new Response(null, {
        status: response.status,
        headers: { Location: location },
      });
    }
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: resHeaders,
  });
}
