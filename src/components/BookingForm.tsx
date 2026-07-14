export function BookingForm() {
  return (
    <form className="mx-auto flex w-full max-w-[500px] flex-col justify-center space-y-3 lg:space-y-2.25">
      <div className="flex flex-col items-center space-y-1 text-center lg:space-y-0.5">
        <h2 className="font-serif text-[1.9rem] italic leading-tight text-[var(--earth)] md:text-[2.05rem] lg:text-[1.95rem]">Reserva de turnos</h2>
        <p className="mx-auto max-w-[32ch] text-[0.88rem] leading-[1.42] text-[color:var(--muted-ink)] md:text-[0.9rem] lg:max-w-[31ch]">
          Completa tu consulta y te responderemos con disponibilidad, detalles y recomendaciones.
        </p>
      </div>

      <div className="grid gap-2 md:grid-cols-2 lg:gap-2.25">
        <label className="field-group w-full text-left">
          <span>Fecha preferida</span>
          <input type="date" defaultValue="2026-07-12" />
        </label>
        <label className="field-group w-full text-left">
          <span>Horario</span>
          <select defaultValue="Manana 09:00 - 12:00">
            <option>Manana 09:00 - 12:00</option>
            <option>Tarde 15:00 - 18:00</option>
            <option>Flexible</option>
          </select>
        </label>
      </div>

      <label className="field-group w-full text-left">
        <span>Nombre completo</span>
        <input type="text" placeholder="Tu nombre" />
      </label>
      <label className="field-group w-full text-left">
        <span>Telefono</span>
        <input type="tel" placeholder="+54 9 2302 55 5555" />
      </label>
      <label className="field-group w-full text-left">
        <span>Mensaje opcional</span>
        <textarea rows={4} placeholder="Contanos si queres reservar, consultar por productos o coordinar una visita." />
      </label>

      <button type="submit" className="primary-button reservation-submit w-full cursor-pointer justify-center py-2.5">
        Enviar solicitud
      </button>
    </form>
  );
}
