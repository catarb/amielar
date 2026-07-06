export function BookingForm() {
  return (
    <form className="card-shell mx-auto flex w-full max-w-[560px] flex-col justify-center space-y-4 p-5 md:space-y-4 md:p-6 xl:p-7">
      <div className="space-y-2 text-center">
        <span className="label-chip">Reserva de turnos</span>
        <p className="mx-auto max-w-[34ch] text-[0.96rem] leading-7 text-[color:var(--muted-ink)]">
          Completa tu consulta y te responderemos con disponibilidad, detalles y recomendaciones.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <label className="field-group">
          <span>Fecha preferida</span>
          <input type="date" defaultValue="2026-07-12" />
        </label>
        <label className="field-group">
          <span>Horario</span>
          <select defaultValue="Manana 09:00 - 12:00">
            <option>Manana 09:00 - 12:00</option>
            <option>Tarde 15:00 - 18:00</option>
            <option>Flexible</option>
          </select>
        </label>
      </div>

      <label className="field-group">
        <span>Nombre completo</span>
        <input type="text" placeholder="Tu nombre" />
      </label>
      <label className="field-group">
        <span>Telefono</span>
        <input type="tel" placeholder="+54 9 2302 55 5555" />
      </label>
      <label className="field-group">
        <span>Mensaje opcional</span>
        <textarea rows={3} placeholder="Contanos si queres reservar, consultar por productos o coordinar una visita." />
      </label>

      <button type="submit" className="primary-button w-full justify-center">
        Enviar solicitud
      </button>
    </form>
  );
}
