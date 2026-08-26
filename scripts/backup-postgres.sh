#!/usr/bin/env bash
set -Eeuo pipefail

ENV_FILE="${ENV_FILE:-.env.production}"
PROJECT_NAME="${COMPOSE_PROJECT_NAME:-amielar-production}"
BACKUP_DIR="${BACKUP_DIR:-./backups/postgres}"
COMPOSE_PRODUCTION="${COMPOSE_PRODUCTION:-1}"
DOCKER_BIN="${DOCKER_BIN:-docker}"
COMPOSE_ARGS=(-f compose.yaml)
if [[ "$COMPOSE_PRODUCTION" == "1" ]]; then
  COMPOSE_ARGS+=(-f compose.production.yaml)
fi

if [[ ! -f "$ENV_FILE" ]]; then
  printf 'Environment file not found: %s\n' "$ENV_FILE" >&2
  exit 1
fi

mkdir -p "$BACKUP_DIR"
timestamp="$(date -u +%Y-%m-%dT%H%M%SZ)"
output="$BACKUP_DIR/amielar_${timestamp}.dump"
temporary="${output}.tmp"

cleanup() {
  rm -f -- "$temporary"
}
trap cleanup EXIT

"$DOCKER_BIN" compose -p "$PROJECT_NAME" --env-file "$ENV_FILE" "${COMPOSE_ARGS[@]}" exec -T db \
  sh -c 'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" -Fc' > "$temporary"

if [[ ! -s "$temporary" ]]; then
  printf 'Backup output is empty.\n' >&2
  exit 1
fi

mv -- "$temporary" "$output"
printf 'Backup created: %s\n' "$output"
