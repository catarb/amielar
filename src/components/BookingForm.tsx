export function BookingForm() {
  return (
    <form className="mx-auto flex w-full max-w-[540px] flex-col justify-center space-y-3.5">
      <div className="flex flex-col items-center space-y-2 text-center">
        <h2 className="font-serif text-[2rem] italic leading-tight text-[var(--earth)] md:text-[2.25rem]">Reserva de turnos</h2>
        <p className="mx-auto max-w-[34ch] text-[0.92rem] leading-6 text-[color:var(--muted-ink)]">
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

      <button type="submit" className="primary-button reservation-submit w-full justify-center py-3">
        Enviar solicitud
      </button>
    </form>
  );
}
