# AMIELAR: preparación de deploy

Esta guía describe el procedimiento futuro para un VPS. No crea secretos, no modifica DNS y no ejecuta ningún deploy por sí misma.

## Prerrequisitos

- VPS provisionado y acceso SSH verificado.
- Docker y Compose instalados y validados.
- Puertos públicos limitados a SSH, HTTP y HTTPS según el firewall.
- `.env.production` creado en el servidor, fuera de Git, con valores reales y contraseñas URL-encoded dentro de `DATABASE_URL`.
- Imágenes publicadas en GHCR mediante el workflow manual y referenciadas por tag Git SHA inmutable.
- Base productiva nueva, sin copiar volúmenes locales ni datos QA.
- Backup externo configurado antes de declarar producción operativa.

Generar posteriormente, sin reutilizar QA:

- `POSTGRES_PASSWORD` aleatoria.
- Hash scrypt nuevo para `ADMIN_PASSWORD_HASH`.
- `ADMIN_SESSION_SECRET` aleatorio de al menos 32 bytes.

## Build externo y distribución GHCR

El build se ejecuta externamente mediante `.github/workflows/build-images.yml` con `workflow_dispatch`. El workflow publica en GHCR:

- `ghcr.io/catarb/amielar-app:<git-sha>` desde el target `runner`.
- `ghcr.io/catarb/amielar-migrator:<git-sha>` desde el target `migrator`.

También actualiza el alias móvil `staging`. El tag SHA es la referencia confiable para desplegar y para volver a la versión anterior. El workflow no accede por SSH, no ejecuta migraciones y no despliega.

Si los paquetes GHCR son privados, el VPS necesitará posteriormente `docker login ghcr.io` con un token de mínimo privilegio que tenga únicamente `read:packages`. Ese token no se crea ni se guarda en este repositorio.

## Deploy inicial

Usar `compose.yaml` junto con `compose.production.yaml`, definiendo `APP_IMAGE` y `MIGRATOR_IMAGE` en `.env.production` con el mismo release SHA:

```sh
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml up -d db
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml run --rm migrate
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml up -d app caddy
```

El overlay productivo consume imágenes remotas y no contiene builds para `app` ni `migrate`. En el VPS no se ejecutan `npm install`, `npm run build` ni se instala Node/npm en el host.

Verificar:

```sh
curl -fsS https://amielarargentina.com/api/health
docker compose --env-file .env.production -f compose.yaml -f compose.production.yaml ps
```

## HTTPS de staging

Staging usa un Caddyfile y volumenes independientes de produccion. En `/srv/amielar/staging/.env.staging` deben definirse:

```env
CADDYFILE_PATH=./Caddyfile.staging
CADDY_DATA_VOLUME_NAME=amielar-staging-caddy-data
CADDY_CONFIG_VOLUME_NAME=amielar-staging-caddy-config
APP_ORIGIN=https://staging.amielarargentina.com
```

`Caddyfile.staging` atiende exclusivamente `staging.amielarargentina.com` y hace proxy a `app:3000`. El volumen PostgreSQL de staging debe conservarse como `amielar-staging-postgres-data`; los volumenes de Caddy no deben reutilizar los de produccion.

El subdominio de staging requiere un registro DNS independiente apuntando al VPS. El apex y `www` no se modifican. Solo se debe iniciar Caddy una vez que el dominio de staging resuelva al VPS y se haya verificado el preflight correspondiente. Esta preparacion no cambia `MX`, `SPF`, `DKIM` ni `DMARC`.

## Nueva versión

1. Crear y verificar un backup.
2. Obtener la nueva imagen por `docker compose pull` usando el release SHA seleccionado.
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

## Rollback de imágenes

Para un rollback de aplicación sin migración incompatible, seleccionar el tag SHA anterior en `APP_IMAGE` y mantener `MIGRATOR_IMAGE` correspondiente a ese release. No prometer rollback automático de schema: el backup previo a migraciones sigue siendo obligatorio.
