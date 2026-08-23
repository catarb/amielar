"use client";

import { useCallback, useRef, useState } from "react";

import { WhatsAppLink } from "@/components/WhatsAppLink";
import { EXPERIENCES, getExperienceLabel } from "@/server/domain/reservations/experiences";

type AvailabilitySlot = { startTime: string; endTime: string };
type FieldErrors = Record<string, string>;
type FormValues = {
  experienceSlug: string;
  date: string;
  startTime: string;
  fullName: string;
  phone: string;
  locality: string;
  peopleCount: string;
  message: string;
};

const INITIAL_VALUES: FormValues = {
  experienceSlug: "",
  date: "",
  startTime: "",
  fullName: "",
  phone: "",
  locality: "",
  peopleCount: "",
  message: "",
};

const INITIAL_AVAILABILITY_ERROR = "No pudimos consultar los horarios disponibles. Intentá nuevamente.";

export function BookingForm() {
  const [values, setValues] = useState<FormValues>(INITIAL_VALUES);
  const [slots, setSlots] = useState<AvailabilitySlot[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [availabilityError, setAvailabilityError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState(false);
  const requestId = useRef(0);

  const loadAvailability = useCallback(async (date: string) => {
    const currentRequest = ++requestId.current;
    setLoadingAvailability(true);
    setAvailabilityError("");
    setSlots([]);

    try {
      const response = await fetch(`/api/disponibilidad?date=${encodeURIComponent(date)}`);
      const body = (await response.json()) as { slots?: AvailabilitySlot[]; error?: { code?: string } };

      if (currentRequest !== requestId.current) return;
      if (!response.ok) {
        setAvailabilityError(body.error?.code === "OUT_OF_SEASON"
          ? "La experiencia Aire de Colmena se encuentra disponible de septiembre a abril."
          : INITIAL_AVAILABILITY_ERROR);
        return;
      }

      setSlots(Array.isArray(body.slots) ? body.slots : []);
    } catch {
      if (currentRequest === requestId.current) setAvailabilityError(INITIAL_AVAILABILITY_ERROR);
    } finally {
      if (currentRequest === requestId.current) setLoadingAvailability(false);
    }
  }, []);

  function handleDateChange(date: string) {
    requestId.current += 1;
    setValues((current) => ({ ...current, date, startTime: "" }));
    setSlots([]);
    setAvailabilityError("");
    setLoadingAvailability(false);
    setSubmitError("");
    setFieldErrors((current) => ({ ...current, date: "", startTime: "" }));
    if (date) void loadAvailability(date);
  }

  function updateValue(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: "" }));
    setSubmitError("");
  }

  function validateForm(): FieldErrors {
    const errors: FieldErrors = {};
    if (!values.experienceSlug) errors.experienceSlug = "Elegí una experiencia.";
    if (!values.date) errors.date = "Elegí una fecha.";
    if (!values.startTime) errors.startTime = "Elegí un horario disponible.";
    if (!values.fullName.trim()) errors.fullName = "Ingresá tu nombre completo.";
    if (!values.phone.trim()) errors.phone = "Ingresá tu teléfono.";
    if (!values.locality.trim()) errors.locality = "Ingresá tu localidad.";
    if (!values.peopleCount) errors.peopleCount = "Elegí la cantidad de personas.";
    if (values.peopleCount !== "1" && values.peopleCount !== "2") errors.peopleCount = "Elegí 1 o 2 personas.";
    if (values.message.length > 1000) errors.message = "El mensaje no puede superar 1000 caracteres.";
    return errors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const errors = validateForm();
    setFieldErrors(errors);
    setSubmitError("");
    if (Object.keys(errors).length > 0) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/reservas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          experienceSlug: values.experienceSlug,
          date: values.date,
          startTime: values.startTime,
          fullName: values.fullName,
          phone: values.phone,
          locality: values.locality,
          peopleCount: Number(values.peopleCount),
          message: values.message || undefined,
          website: "",
        }),
      });
      const body = (await response.json()) as { error?: { code?: string; fields?: FieldErrors } };

      if (response.status === 201) {
        setSuccess(true);
        return;
      }

      if (body.error?.code === "SLOT_UNAVAILABLE") {
        setSubmitError("Ese horario acaba de dejar de estar disponible. Elegí otro horario.");
        setValues((current) => ({ ...current, startTime: "" }));
        await loadAvailability(values.date);
      } else if (body.error?.code === "RATE_LIMITED") {
        setSubmitError("Hiciste varios intentos seguidos. Esperá unos minutos antes de volver a intentar.");
      } else if (body.error?.code === "SLOT_BLOCKED") {
        setSubmitError("Ese horario ya no está disponible. Elegí otro horario.");
        setValues((current) => ({ ...current, startTime: "" }));
        await loadAvailability(values.date);
      } else if (body.error?.code === "BOOKING_WINDOW_CLOSED") {
        setSubmitError("Ya no es posible reservar ese horario. Elegí otro disponible.");
        setValues((current) => ({ ...current, startTime: "" }));
        await loadAvailability(values.date);
      } else if (body.error?.code === "VALIDATION_ERROR") {
        setFieldErrors(body.error.fields ?? {});
        setSubmitError("Revisá los datos ingresados.");
      } else {
        setSubmitError("No pudimos procesar tu reserva en este momento. Intentá nuevamente.");
      }
    } catch {
      setSubmitError("No pudimos procesar tu reserva en este momento. Intentá nuevamente.");
    } finally {
      setSubmitting(false);
    }
  }

  function resetForm() {
    requestId.current += 1;
    setValues(INITIAL_VALUES);
    setSlots([]);
    setAvailabilityError("");
    setSubmitError("");
    setFieldErrors({});
    setSuccess(false);
  }

  if (success) {
    const experienceLabel = getExperienceLabel(values.experienceSlug);
    const whatsappMessage = [
      "Hola, quería continuar con mi solicitud de reserva de AMIELAR.",
      "",
      `Experiencia: ${experienceLabel}`,
      `Nombre: ${values.fullName}`,
      `Fecha: ${values.date}`,
      `Horario: ${values.startTime}`,
      `Personas: ${values.peopleCount}`,
      `Localidad: ${values.locality}`,
      `Teléfono: ${values.phone}`,
      values.message ? `Mensaje adicional: ${values.message}` : "",
      "",
      "Quisiera coordinar el valor, la forma de pago y los demás detalles.",
    ].filter(Boolean).join("\n");

    return (
      <section className="reservation-success-state mx-auto flex w-full max-w-[500px] flex-col justify-center space-y-3 text-center" aria-live="polite">
        <div className="rounded-[1.25rem] border border-[rgba(164,131,53,0.2)] bg-[rgba(255,252,244,0.82)] p-5 shadow-[0_10px_25px_rgba(80,58,28,0.06)]">
          <h2 className="font-serif text-[1.9rem] italic leading-tight text-[var(--earth)]">¡Recibimos tu reserva!</h2>
          <p className="mt-3 text-[0.92rem] leading-[1.5] text-[color:var(--muted-ink)]">
            Tu solicitud quedó registrada. Continuá por WhatsApp para coordinar el valor, la forma de pago y los detalles de la experiencia.
          </p>
          <dl className="mx-auto mt-4 grid max-w-[360px] grid-cols-2 gap-2 text-left text-[0.78rem] text-[color:var(--muted-ink)] sm:grid-cols-4">
            <div><dt className="font-semibold text-[var(--earth)]">Experiencia</dt><dd>{experienceLabel}</dd></div>
            <div><dt className="font-semibold text-[var(--earth)]">Fecha</dt><dd>{values.date}</dd></div>
            <div><dt className="font-semibold text-[var(--earth)]">Horario</dt><dd>{values.startTime}</dd></div>
            <div><dt className="font-semibold text-[var(--earth)]">Personas</dt><dd>{values.peopleCount}</dd></div>
          </dl>
        </div>
        <WhatsAppLink message={whatsappMessage} className="primary-button mx-auto w-full justify-center">Continuar por WhatsApp</WhatsAppLink>
        <button type="button" className="secondary-button mx-auto w-full justify-center" onClick={resetForm}>Hacer otra reserva</button>
      </section>
    );
  }

  return (
    <form className="mx-auto flex w-full max-w-[500px] flex-col justify-center space-y-3 lg:space-y-1.5" onSubmit={handleSubmit} noValidate>
      <input name="website" type="text" value="" readOnly tabIndex={-1} aria-hidden="true" autoComplete="off" className="absolute h-px w-px overflow-hidden opacity-0" />
      <div className="flex flex-col items-center space-y-1 text-center lg:space-y-0.5">
        <h2 className="font-serif text-[1.9rem] italic leading-tight text-[var(--earth)] md:text-[2.05rem] lg:text-[1.95rem]">Reserva de turnos</h2>
        <p className="mx-auto max-w-[32ch] text-[0.88rem] leading-[1.42] text-[color:var(--muted-ink)] md:text-[0.9rem] lg:max-w-[31ch]">
          Aire de Colmena · Elegí tu fecha y horario para dejarnos tu consulta.
        </p>
      </div>

      <Field label="¿Qué experiencia te interesa?" id="reservation-experience" error={fieldErrors.experienceSlug}>
        <select id="reservation-experience" value={values.experienceSlug} onChange={(event) => updateValue("experienceSlug", event.target.value)} aria-invalid={Boolean(fieldErrors.experienceSlug)} aria-describedby={fieldErrors.experienceSlug ? "reservation-experience-error" : undefined} required>
          <option value="">Elegí una experiencia</option>
          {EXPERIENCES.map((experience) => <option key={experience.slug} value={experience.slug}>{experience.label}</option>)}
        </select>
      </Field>

      <div className="grid gap-2 md:grid-cols-2 lg:gap-2.25">
        <Field label="Fecha preferida" id="reservation-date" error={fieldErrors.date}>
          <input id="reservation-date" type="date" value={values.date} onChange={(event) => handleDateChange(event.target.value)} aria-invalid={Boolean(fieldErrors.date)} aria-describedby={fieldErrors.date ? "reservation-date-error" : undefined} required />
        </Field>
        <label className="field-group w-full text-left" htmlFor="reservation-time">
          <span id="reservation-time-label">Horario</span>
          <select id="reservation-time" value={values.startTime} onChange={(event) => updateValue("startTime", event.target.value)} aria-invalid={Boolean(fieldErrors.startTime)} aria-describedby={fieldErrors.startTime ? "reservation-time-error" : undefined} disabled={!values.date || loadingAvailability || Boolean(availabilityError) || slots.length === 0} required>
            <option value="">
              {!values.date ? "Elegí una fecha primero" : loadingAvailability ? "Cargando horarios..." : availabilityError ? "No se pudo cargar horarios" : slots.length === 0 ? "No hay horarios disponibles" : "Elegí un horario"}
            </option>
            {slots.map((slot) => <option key={slot.startTime} value={slot.startTime}>{slot.startTime}</option>)}
          </select>
          {availabilityError && <div className="pt-1 text-[0.82rem] text-[var(--earth)]" role="alert"><p>{availabilityError}</p><button type="button" className="mt-1 underline" onClick={() => void loadAvailability(values.date)}>Intentar nuevamente</button></div>}
          {fieldErrors.startTime && <p id="reservation-time-error" className="mt-1 text-[0.76rem] text-[var(--earth)]" role="alert">{fieldErrors.startTime}</p>}
        </label>
      </div>

      <Field label="Nombre completo" id="reservation-name" error={fieldErrors.fullName}>
        <input id="reservation-name" type="text" placeholder="Tu nombre" value={values.fullName} onChange={(event) => updateValue("fullName", event.target.value)} maxLength={120} aria-invalid={Boolean(fieldErrors.fullName)} aria-describedby={fieldErrors.fullName ? "reservation-name-error" : undefined} required />
      </Field>
      <Field label="Teléfono" id="reservation-phone" error={fieldErrors.phone}>
        <input id="reservation-phone" type="tel" placeholder="+54 9 2302 39-3510" value={values.phone} onChange={(event) => updateValue("phone", event.target.value)} maxLength={40} aria-invalid={Boolean(fieldErrors.phone)} aria-describedby={fieldErrors.phone ? "reservation-phone-error" : undefined} required />
      </Field>
      <div className="grid gap-2 md:grid-cols-2 lg:gap-2.25">
        <Field label="Localidad" id="reservation-locality" error={fieldErrors.locality}>
          <input id="reservation-locality" type="text" placeholder="Tu localidad" value={values.locality} onChange={(event) => updateValue("locality", event.target.value)} maxLength={100} aria-invalid={Boolean(fieldErrors.locality)} aria-describedby={fieldErrors.locality ? "reservation-locality-error" : undefined} required />
        </Field>
        <Field label="Cantidad de personas" id="reservation-people" error={fieldErrors.peopleCount}>
          <select id="reservation-people" value={values.peopleCount} onChange={(event) => updateValue("peopleCount", event.target.value)} aria-invalid={Boolean(fieldErrors.peopleCount)} aria-describedby={fieldErrors.peopleCount ? "reservation-people-error" : undefined} required>
            <option value="">Elegí una opción</option>
            <option value="1">1 persona</option>
            <option value="2">2 personas</option>
          </select>
        </Field>
      </div>
      <Field label="Mensaje opcional" id="reservation-message" error={fieldErrors.message}>
        <textarea id="reservation-message" rows={4} placeholder="Contanos si querés dejarnos algún detalle." value={values.message} onChange={(event) => updateValue("message", event.target.value)} maxLength={1000} aria-invalid={Boolean(fieldErrors.message)} aria-describedby={fieldErrors.message ? "reservation-message-error" : undefined} />
      </Field>

      {submitError && <p className="text-[0.82rem] leading-[1.4] text-[var(--earth)]" role="alert" aria-live="polite">{submitError}</p>}
      <button type="submit" className="primary-button reservation-submit w-full cursor-pointer justify-center py-2.5" disabled={submitting}>
        {submitting ? "Enviando reserva..." : "Enviar solicitud"}
      </button>
    </form>
  );
}

function Field({ label, id, error, children }: { label: string; id: string; error?: string; children: React.ReactNode }) {
  const errorId = `${id}-error`;
  return <label className="field-group w-full text-left" htmlFor={id}><span>{label}</span>{children}{error && <span id={errorId} className="mt-1 text-[0.76rem] text-[var(--earth)]" role="alert">{error}</span>}</label>;
}
