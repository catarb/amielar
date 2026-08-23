# AMIELAR: preparación de deploy

Esta guía describe el procedimiento futuro para un VPS. No crea secretos, no modifica DNS y no ejecuta ningún deploy por sí misma.

## Prerrequisitos

- VPS provisionado y acceso SSH verificado.
- Docker y Compose instalados y validados.
- Puertos públicos limitados a SSH, HTTP y HTTPS según el firewall.
- `.env.production` creado en el servidor, fuera de Git, con valores reales y contraseñas URL-encoded dentro de `DATABASE_URL`.
- Base productiva nueva, sin copiar volúmenes locales ni datos QA.
- Backup externo configurado antes de declarar producción operativa.

Generar posteriormente, sin reutilizar QA:

- `POSTGRES_PASSWORD` aleatoria.
- Hash scrypt nuevo para `ADMIN_PASSWORD_HASH`.
- `ADMIN_SESSION_SECRET` aleatorio de al menos 32 bytes.

## Deploy inicial

Usar `compose.yaml` junto con `compose.production.yaml`:

```sh
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml up -d db
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml run --rm migrate
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml up -d app caddy
```

Verificar:

```sh
curl -fsS https://amielarargentina.com/api/health
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml ps
```

## Nueva versión

1. Crear y verificar un backup.
2. Obtener la nueva imagen o construirla según la estrategia aprobada.
3. Ejecutar migraciones explícitamente.
4. Actualizar `app`.
5. Verificar `/api/health`, logs y rutas públicas.
6. Mantener la versión anterior disponible para rollback.

No ejecutar migraciones automáticamente dentro del arranque de `app`.

## Proxy e IP del cliente

Caddy establece `X-Forwarded-For`, `X-Forwarded-Proto` y `X-Forwarded-Host` de forma implícita y, al recibir directamente al cliente, no confía en valores arbitrarios enviados en esos headers. `Caddyfile.production` fija explícitamente `X-Real-IP` con `{http.request.remote.host}` porque la aplicación también lo utiliza para rate limiting.

Si en el futuro se coloca un CDN o proxy delante de Caddy, habrá que configurar sus rangos como `trusted_proxies` antes de confiar en headers externos.

## Backup

La retención inicial propuesta es de 7 backups diarios y 4 semanales, sujeta al espacio real del VPS. Debe existir una copia fuera del VPS.

```sh
ENV_FILE=.env.production COMPOSE_PRODUCTION=1 \
  ./scripts/backup-postgres.sh
```

Un backup no se considera confiable hasta probar su restore.

## Restore

El script exige confirmación explícita, rechaza por defecto una base que ya contiene reservas o bloqueos, y restaura en la base definida por el entorno seleccionado. No ejecuta `DROP`, `TRUNCATE` ni limpieza automática.

```sh
ENV_FILE=.env.production COMPOSE_PRODUCTION=1 \
  ./scripts/restore-postgres.sh --confirm-restore backups/postgres/amielar_YYYY-MM-DDTHHMMSSZ.dump
```

El caso recomendado de disaster recovery es: preparar PostgreSQL limpio, restaurar el dump, validar y recién después conectar la aplicación. Solo después de una revisión explícita puede usarse `--allow-nonempty` sobre un destino poblado; hacer siempre un backup previo.

## Rollback

### Rollback de aplicación sin migración incompatible

Volver a la imagen anterior, conservar la misma base y verificar `/api/health`. No eliminar el volumen PostgreSQL.

### Migración incompatible

No prometer rollback automático de schema. Detener la promoción, conservar el backup previo y definir una migración correctiva o restauración controlada antes de continuar.

## Checklist de staging

### Público

- `/`, experiencias, assets y mobile.
- `/aire-de-colmena`, `/nuestra-historia`, `/tu-centro-amielar`.

### Reservas

- Tres experiencias.
- Disponibilidad compartida.
- Reserva pública, conflicto, success y WhatsApp.

### Administración

- Login HTTPS y cookie Secure.
- Dashboard, reservas, filtros y detalle.
- Confirmar, cancelar, eliminar.
- Disponibilidad, bloqueos y reserva manual.

### Infraestructura

- HTTPS y HTTP→HTTPS.
- `www`→apex.
- `/api/health` y DB healthy.
- Restart policies y logs rotados.
- IP del proxy y rate limiter.
- Origin validation.

## DNS, correo y seguridad pendiente

El cambio web de DNS no debe alterar `MX`, `SPF`, `DKIM` ni `DMARC` de Google Workspace.

El firewall futuro debe publicar únicamente SSH, HTTP y HTTPS. Los puertos `3000` y `5432` deben permanecer privados.

HSTS debe habilitarse únicamente después de validar HTTPS estable en staging/producción; no usar `preload` inicialmente.

CSP queda pendiente de una validación específica y no bloquea el deploy inicial.

## Distribución de imágenes

No se configura todavía registry ni CI/CD. Las opciones posteriores son build en VPS o registry privado/GHCR. Por los recursos limitados, se recomienda construir externamente y transferir una imagen versionada.
