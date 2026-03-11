import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function POST(request: Request) {
  try {
    const { query, command, rating } = await request.json();

    if (!query || !command || !["up", "down"].includes(rating)) {
      return NextResponse.json({ error: "Invalid feedback" }, { status: 400 });
    }

    logger.info("feedback", {
      query,
      command,
      rating,
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({ ok: true });
  } catch {
    logger.error("feedback_error", { message: "Failed to process feedback" });
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
