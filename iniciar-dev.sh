#!/usr/bin/env bash
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$RAIZ/backend"
FRONTEND="$RAIZ/frontend"
LOGS="$RAIZ/.logs"
mkdir -p "$LOGS"

PUERTO_API=$(grep -E '^PUERTO=' "$BACKEND/.env" 2>/dev/null | cut -d= -f2 || true)
PUERTO_API=${PUERTO_API:-3000}
PUERTO_WEB=${PUERTO_WEB:-4200}

mongo_activo() { (echo > /dev/tcp/127.0.0.1/27017) >/dev/null 2>&1; }

# ---------- liberar puertos si quedaron ocupados por ejecuciones previas ----------
liberar_puerto() {
  local puerto="$1"
  local pids
  pids=$(lsof -t -iTCP:"$puerto" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "⚠️  Puerto $puerto ocupado por PID(s): $pids — liberando..."
    # shellcheck disable=SC2086
    kill -9 $pids 2>/dev/null || true
    sleep 0.5
  fi
}

PID_BACKEND=""
PID_FRONTEND=""

detener() {
  echo ""
  echo "⏹  Deteniendo backend y frontend..."
  for pid in "$PID_BACKEND" "$PID_FRONTEND"; do
    if [ -n "$pid" ]; then
      # matar todo el grupo (npm + nest/ng + node)
      kill -- -"$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true
    fi
  done
  # red de seguridad: si algo quedó vivo en el puerto, lo matamos
  liberar_puerto "$PUERTO_API" >/dev/null 2>&1 || true
  liberar_puerto "$PUERTO_WEB" >/dev/null 2>&1 || true
  echo "   (MongoDB sigue corriendo en Docker; para apagarlo: docker compose down)"
}
trap detener EXIT INT TERM

# ... comprobaciones, MongoDB, dependencias, seed igual que antes ...

# ---------- 4. backend y frontend ----------
liberar_puerto "$PUERTO_API"
liberar_puerto "$PUERTO_WEB"

echo "▶ Iniciando backend..."
# Sin setsid: usamos un subshell con exec para que $! sea el PID real de npm
( cd "$BACKEND" && exec npm run start ) > "$LOGS/backend.log" 2>&1 &
PID_BACKEND=$!

echo "▶ Iniciando frontend..."
( cd "$FRONTEND" && exec npx ng serve --port "$PUERTO_WEB" ) > "$LOGS/frontend.log" 2>&1 &
PID_FRONTEND=$!

# ... esperar backend, mensajes, tail igual que antes ...

# ---------- 5. esperar al backend ----------
for _ in $(seq 1 60); do
  curl -s -o /dev/null "http://localhost:$PUERTO_API/api" && break
  sleep 2
done

echo ""
echo "   Todo en marcha"
echo "   Frontend: http://localhost:4200"
echo "   API:      http://localhost:$PUERTO_API   (Swagger en /api)"
echo ""
echo "   Cuentas de prueba (contraseña Demo12345): ana@gestor.com, luis@gestor.com, maria@gestor.com"
echo "   Administrador: el de backend/.env"
echo ""
echo "   Registros en vivo abajo. Ctrl+C detiene backend y frontend."
echo "-----------------------------------------------------------"

tail -n +1 -f "$LOGS/backend.log" "$LOGS/frontend.log"