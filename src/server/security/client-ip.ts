export function getClientIp(request: Request): string | null {
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstAddress = forwardedFor.split(",").map((value) => value.trim()).find(Boolean);
    if (firstAddress) return firstAddress;
  }

  const realIp = request.headers.get("x-real-ip")?.trim();
  return realIp || null;
}
