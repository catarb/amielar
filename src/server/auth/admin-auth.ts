import { cookies } from "next/headers";

import { ADMIN_SESSION_COOKIE } from "./constants";
import { createAdminSessionToken, verifyAdminSessionToken, type AdminSession } from "./session";
import { verifyPassword } from "./password";

export type AdminAuthConfig = {
  username: string;
  passwordHash: string;
  sessionSecret: string;
};

type AuthEnvironment = Record<string, string | undefined>;

export function readAdminAuthConfig(env: AuthEnvironment = process.env): AdminAuthConfig | null {
  const username = env.ADMIN_USERNAME?.trim();
  const passwordHash = env.ADMIN_PASSWORD_HASH?.trim();
  const sessionSecret = env.ADMIN_SESSION_SECRET;
  if (!username || !passwordHash || !sessionSecret || Buffer.byteLength(sessionSecret, "utf8") < 32) {
    return null;
  }
  return { username, passwordHash, sessionSecret };
}

export async function authenticateAdmin(
  username: string,
  password: string,
  env: AuthEnvironment = process.env,
): Promise<string | null> {
  const config = readAdminAuthConfig(env);
  if (!config || username !== config.username) return null;
  if (!(await verifyPassword(password, config.passwordHash))) return null;
  return createAdminSessionToken(config.username, config.sessionSecret);
}

export async function getAdminSession(
  cookieStore = cookies(),
  env: AuthEnvironment = process.env,
): Promise<AdminSession | null> {
  const config = readAdminAuthConfig(env);
  if (!config) return null;
  const token = (await cookieStore).get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = verifyAdminSessionToken(token, config.sessionSecret);
  return session?.username === config.username ? session : null;
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getAdminSession()) !== null;
}
