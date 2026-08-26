#!/usr/bin/env bash
set -Eeuo pipefail

ENV_FILE="${ENV_FILE:-.env.production}"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-amielar-production}"
COMPOSE_PRODUCTION="${COMPOSE_PRODUCTION:-1}"
DOCKER_BIN="${DOCKER_BIN:-docker}"
COMPOSE_ARGS=(-f compose.yaml)
if [[ "$COMPOSE_PRODUCTION" == "1" ]]; then
  COMPOSE_ARGS+=(-f compose.production.yaml)
fi

if [[ "${1:-}" != "--confirm-restore" || -z "${2:-}" ]]; then
  printf 'Usage: %s --confirm-restore path/to/backup.dump [--allow-nonempty]\n' "$0" >&2
  exit 2
fi

dump_file="$2"
allow_nonempty=0
if [[ "${3:-}" == "--allow-nonempty" && -z "${4:-}" ]]; then
  allow_nonempty=1
elif [[ -n "${3:-}" ]]; then
  printf 'Usage: %s --confirm-restore path/to/backup.dump [--allow-nonempty]\n' "$0" >&2
  exit 2
fi

if [[ ! -f "$dump_file" ]]; then
  printf 'Dump file not found: %s\n' "$dump_file" >&2
  exit 1
fi

if [[ ! -f "$ENV_FILE" ]]; then
  printf 'Environment file not found: %s\n' "$ENV_FILE" >&2
  exit 1
fi

existing_rows="$("$DOCKER_BIN" compose -p "$PROJECT_NAME" --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" exec -T db \
  sh -c 'psql -Atq -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT CASE WHEN to_regclass('\''public.reservations'\'') IS NULL THEN 0 ELSE 1 END;"' \
  | tr -d '[:space:]')"

if [[ "$existing_rows" == "1" ]]; then
  existing_rows="$("$DOCKER_BIN" compose -p "$PROJECT_NAME" --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" exec -T db \
    sh -c 'psql -Atq -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT count(*) FROM public.reservations;"' \
    | tr -d '[:space:]')"
else
  existing_rows=0
fi

if [[ "$existing_rows" == "0" ]]; then
  availability_exists="$("$DOCKER_BIN" compose -p "$PROJECT_NAME" --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" exec -T db \
    sh -c 'psql -Atq -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT CASE WHEN to_regclass('\''public.availability_blocks'\'') IS NULL THEN 0 ELSE 1 END;"' \
    | tr -d '[:space:]')"
  if [[ "$availability_exists" == "1" ]]; then
    availability_rows="$("$DOCKER_BIN" compose -p "$PROJECT_NAME" --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" exec -T db \
      sh -c 'psql -Atq -U "$POSTGRES_USER" -d "$POSTGRES_DB" -c "SELECT count(*) FROM public.availability_blocks;"' \
      | tr -d '[:space:]')"
    existing_rows=$((existing_rows + availability_rows))
  fi
fi

if [[ ! "$existing_rows" =~ ^[0-9]+$ ]]; then
  printf 'Could not determine whether the target database is empty.\n' >&2
  exit 1
fi

if (( existing_rows > 0 && allow_nonempty == 0 )); then
  printf 'Target database contains AMIELAR data; use a clean database or --allow-nonempty after explicit review.\n' >&2
  exit 1
fi

cat -- "$dump_file" | "$DOCKER_BIN" compose -p "$PROJECT_NAME" --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" exec -T db \
  sh -c 'set -Ee; temporary=/tmp/amielar-restore.dump; trap '\''rm -f -- "$temporary"'\'' EXIT; cat > "$temporary"; pg_restore --no-owner --exit-on-error -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$temporary"'

printf 'Restore completed into the configured database.\n'
