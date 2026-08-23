export const PUBLIC_RESERVATION_BODY_BYTES = 16 * 1024;
export const ADMIN_LOGIN_BODY_BYTES = 4 * 1024;
export const ADMIN_RESERVATION_ACTION_BODY_BYTES = 4 * 1024;
export const ADMIN_BLOCK_BODY_BYTES = 8 * 1024;
export const ADMIN_RESERVATION_CREATE_BODY_BYTES = 8 * 1024;

export type LimitedJsonResult<T> =
  | { ok: true; value: T }
  | { ok: false; reason: "too_large" | "invalid_json" };

export async function readLimitedJson<T = unknown>(
  request: Request,
  maxBytes: number,
): Promise<LimitedJsonResult<T>> {
  const contentLength = request.headers.get("content-length");
  const declaredLength = contentLength === null ? null : Number(contentLength);
  if (declaredLength !== null && Number.isFinite(declaredLength) && declaredLength > maxBytes) {
    return { ok: false, reason: "too_large" };
  }

  let rawBody: ArrayBuffer;
  try {
    rawBody = await request.arrayBuffer();
  } catch {
    return { ok: false, reason: "invalid_json" };
  }

  if (rawBody.byteLength > maxBytes) {
    return { ok: false, reason: "too_large" };
  }

  try {
    const text = new TextDecoder("utf-8", { fatal: true }).decode(rawBody);
    return { ok: true, value: JSON.parse(text) as T };
  } catch {
    return { ok: false, reason: "invalid_json" };
  }
}
