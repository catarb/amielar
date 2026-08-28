type OriginEnvironment = Record<string, string | undefined>;

export function isAllowedOrigin(request: Request, env: OriginEnvironment = process.env): boolean {
  const requestOrigin = request.headers.get("origin");
  const configuredOrigin = env.APP_ORIGIN?.trim();
  if (!requestOrigin || !configuredOrigin) return false;

  try {
    const expected = new URL(configuredOrigin);
    const actual = new URL(requestOrigin);
    if (
      !["http:", "https:"].includes(expected.protocol) ||
      expected.username ||
      expected.password ||
      expected.search ||
      expected.hash ||
      (expected.pathname !== "/" && expected.pathname !== "")
    ) return false;

    if (expected.protocol === actual.protocol && expected.hostname === actual.hostname && expected.port === actual.port) return true;

    if (env.NODE_ENV === "development") {
      return new URL(request.url).origin === actual.origin;
    }

    return false;
  } catch {
    return false;
  }
}
