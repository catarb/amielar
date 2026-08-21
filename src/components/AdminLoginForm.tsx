"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmitting) return;
    setError("");
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      if (response.ok) {
        router.replace("/admin");
        router.refresh();
        return;
      }
      setError(response.status === 429 ? "Demasiados intentos. Esperá unos minutos antes de volver a intentar." : "Usuario o contraseÃ±a incorrectos.");
    } catch {
      setError("No se pudo iniciar sesiÃ³n. Intentá nuevamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 space-y-5">
      <label className="block text-sm font-semibold text-[var(--earth)]">
        Usuario
        <input
          name="username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          autoComplete="username"
          required
          className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(67,59,38,0.15)] bg-white/80 px-4 text-[var(--ink)] outline-none transition focus:border-[var(--gold-deep)]"
        />
      </label>
      <label className="block text-sm font-semibold text-[var(--earth)]">
        ContraseÃ±a
        <input
          name="password"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          autoComplete="current-password"
          required
          className="mt-2 min-h-12 w-full rounded-2xl border border-[rgba(67,59,38,0.15)] bg-white/80 px-4 text-[var(--ink)] outline-none transition focus:border-[var(--gold-deep)]"
        />
      </label>
      {error ? <p role="alert" className="rounded-2xl bg-[rgba(197,95,81,0.1)] px-4 py-3 text-sm text-[#a3483d]">{error}</p> : null}
      <button type="submit" disabled={isSubmitting} className="primary-button min-h-12 w-full justify-center disabled:cursor-wait disabled:opacity-60">
        {isSubmitting ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
