import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";

const NO_STORE_HEADERS = { "Cache-Control": "no-store" };

export const dynamic = "force-dynamic";

async function checkDatabase(): Promise<void> {
  const { db } = await import("@/server/db/client");
  await db.execute(sql`select 1`);
}

export async function GET(): Promise<Response> {
  return handleHealthRequest(checkDatabase);
}

export async function handleHealthRequest(
  verifyDatabase: () => Promise<void> = checkDatabase,
): Promise<Response> {
  try {
    await verifyDatabase();
    return NextResponse.json({ status: "ok" }, { status: 200, headers: NO_STORE_HEADERS });
  } catch (error) {
    console.error("Healthcheck database probe failed", {
      errorType: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json({ status: "unavailable" }, { status: 503, headers: NO_STORE_HEADERS });
  }
}
