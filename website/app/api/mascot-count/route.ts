import { NextRequest, NextResponse } from "next/server";
import { Redis } from "@upstash/redis";

const KEY = "wormkey:mascot:generated";

function isLocalDev(request: NextRequest) {
  const host = request.headers.get("host") ?? "";
  return host.startsWith("localhost") || host.startsWith("127.0.0.1");
}

function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

export async function GET() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0 });
  }
  try {
    const count = await redis.get<number>(KEY);
    return NextResponse.json({ count: typeof count === "number" ? count : 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

export async function POST() {
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0 });
  }
  try {
    const count = await redis.incr(KEY);
    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}

/** Reset counter to 0. Only allowed on localhost (for local testing). */
export async function DELETE(request: NextRequest) {
  if (!isLocalDev(request)) {
    return NextResponse.json({ error: "Reset only allowed on localhost" }, { status: 403 });
  }
  const redis = getRedis();
  if (!redis) {
    return NextResponse.json({ count: 0 });
  }
  try {
    await redis.set(KEY, 0);
    return NextResponse.json({ count: 0 });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
