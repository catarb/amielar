import { NextResponse } from "next/server";

import { ADMIN_SESSION_COOKIE, expiredAdminSessionCookieOptions } from "@/server/auth/session";

export async function POST(): Promise<Response> {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set(ADMIN_SESSION_COOKIE, "", expiredAdminSessionCookieOptions());
  return response;
}
