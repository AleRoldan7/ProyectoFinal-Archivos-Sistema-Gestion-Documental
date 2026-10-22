#!/usr/bin/env bash
set -euo pipefail

RAIZ="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$RAIZ/backend"
FRONTEND="$RAIZ/frontend"
LOGS="$RAIZ/.logs"
mkdir -p "$LOGS"

PUERTO_API=$(grep -E '^PUERTO=' "$BACKEND/.env" 2>/dev/null | cut -d= -f2 || true)
PUERTO_API=${PUERTO_API:-3000}

mongo_activo() { (echo > /dev/tcp/127.0.0.1/27017) >/dev/null 2>&1; }

PID_BACKEND=""
PID_FRONTEND=""

detener() {
  echo ""
  echo "⏹  Deteniendo backend y frontend..."
  for pid in "$PID_BACKEND" "$PID_FRONTEND"; do
    [ -n "$pid" ] && { kill -- -"$pid" 2>/dev/null || kill "$pid" 2>/dev/null || true; }
  done
  echo "   (MongoDB sigue corriendo en Docker; para apagarlo: docker compose down)"
}
trap detener EXIT INT TERM

# ---------- comprobaciones ----------
[ -f "$BACKEND/.env" ] || { echo "❌ Falta backend/.env"; exit 1; }

# ---------- 1. MongoDB ----------
if mongo_activo; then
  echo "✔ MongoDB ya está activo en el puerto 27017"
else
  command -v docker >/dev/null || { echo "❌ MongoDB no responde y Docker no está instalado"; exit 1; }
  echo "▶ Levantando MongoDB con Docker..."
  docker compose -f "$RAIZ/docker-compose.yml" up -d mongo
  for _ in $(seq 1 30); do mongo_activo && break; sleep 2; done
  mongo_activo || { echo "❌ MongoDB no respondió a tiempo"; exit 1; }
  echo "✔ MongoDB listo"
fi

# ---------- 2. dependencias ----------
[ -d "$BACKEND/node_modules" ]  || { echo "▶ npm install (backend)...";  (cd "$BACKEND"  && npm install); }
[ -d "$FRONTEND/node_modules" ] || { echo "▶ npm install (frontend)..."; (cd "$FRONTEND" && npm install); }

# ---------- 3. datos de demostración (si ya existen, no hace nada) ----------
echo "▶ Cargando datos de demostración..."
(cd "$BACKEND" && npm run seed)

# ---------- 4. backend y frontend ----------
echo "▶ Iniciando backend..."
(cd "$BACKEND" && setsid npm run start > "$LOGS/backend.log" 2>&1) &
PID_BACKEND=$!

echo "▶ Iniciando frontend..."
(cd "$FRONTEND" && setsid npx ng serve > "$LOGS/frontend.log" 2>&1) &
PID_FRONTEND=$!

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