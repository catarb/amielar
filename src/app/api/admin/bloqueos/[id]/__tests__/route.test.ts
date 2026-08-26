import { describe, expect, it, vi } from "vitest";

import { handleAdminBlockDeleteRequest } from "../route";

const id = "11111111-1111-4111-8111-111111111111";
const request = new Request(`http://localhost/api/admin/bloqueos/${id}`, { method: "DELETE", headers: { origin: "http://localhost" } });

describe("DELETE admin bloqueos", () => {
  it("mantiene auth antes de CSRF y elimina un UUID válido", async () => {
    const remove = vi.fn().mockResolvedValue(undefined);
    expect((await handleAdminBlockDeleteRequest(request, id, async () => false, () => true, remove)).status).toBe(401);
    expect((await handleAdminBlockDeleteRequest(request, id, async () => true, () => true, remove)).status).toBe(200);
    expect(remove).toHaveBeenCalledWith(id);
  });
});
